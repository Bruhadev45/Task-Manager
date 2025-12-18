"""
Task router - handles all task-related API endpoints.

This module provides CRUD operations for tasks and natural language parsing.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime, date, timedelta
import re
from app.database import supabase
from app.models import (
    TaskCreate, 
    TaskUpdate, 
    TaskResponse,
    NaturalLanguageParseRequest,
    NaturalLanguageParseResponse,
    TaskStatus,
    TaskPriority
)

router = APIRouter()


def parse_natural_language(text: str) -> NaturalLanguageParseResponse:
    """
    Parse natural language text into structured task fields.
    
    This function extracts:
    - Title: Main task description
    - Priority: high, medium, low (from keywords)
    - Due date: tomorrow, today, specific dates
    - Status: Usually defaults to 'todo'
    - List: personal, work (from keywords)
    
    Example: "Call John tomorrow about the project proposal, high priority"
    Returns: {
        title: "Call John about the project proposal",
        priority: "high",
        due_date: tomorrow's date,
        status: "todo"
    }
    """
    text_lower = text.lower().strip()
    
    # Extract priority keywords
    priority = TaskPriority.MEDIUM
    if any(word in text_lower for word in ['high priority', 'urgent', 'important', 'asap', 'critical']):
        priority = TaskPriority.HIGH
    elif any(word in text_lower for word in ['low priority', 'whenever', 'someday']):
        priority = TaskPriority.LOW
    
    # Extract due date keywords
    due_date = None
    today = date.today()
    
    # Check for relative dates
    if 'tomorrow' in text_lower:
        due_date = today + timedelta(days=1)
        text = re.sub(r'\btomorrow\b', '', text, flags=re.IGNORECASE).strip()
    elif 'today' in text_lower:
        due_date = today
        text = re.sub(r'\btoday\b', '', text, flags=re.IGNORECASE).strip()
    elif 'next week' in text_lower:
        due_date = today + timedelta(days=7)
        text = re.sub(r'\bnext week\b', '', text, flags=re.IGNORECASE).strip()
    elif 'next month' in text_lower:
        due_date = today + timedelta(days=30)
        text = re.sub(r'\bnext month\b', '', text, flags=re.IGNORECASE).strip()
    elif 'in a week' in text_lower or 'in 1 week' in text_lower:
        due_date = today + timedelta(days=7)
        text = re.sub(r'\bin (a |1 )?week\b', '', text, flags=re.IGNORECASE).strip()
    elif 'in 2 weeks' in text_lower or 'in two weeks' in text_lower:
        due_date = today + timedelta(days=14)
        text = re.sub(r'\bin (2 |two )?weeks\b', '', text, flags=re.IGNORECASE).strip()
    
    # Try to extract specific dates (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD)
    date_patterns = [
        r'\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b',  # DD/MM/YYYY or DD-MM-YYYY
        r'\b(\d{4})[/-](\d{1,2})[/-](\d{1,2})\b',  # YYYY-MM-DD
        r'\b(\d{1,2})[/-](\d{1,2})\b',  # DD/MM (assume current year)
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            try:
                if len(match.groups()) == 3:
                    if len(match.group(1)) == 4:  # YYYY-MM-DD format
                        due_date = date(int(match.group(1)), int(match.group(2)), int(match.group(3)))
                    else:  # DD/MM/YYYY format
                        due_date = date(int(match.group(3)), int(match.group(2)), int(match.group(1)))
                else:  # DD/MM format
                    due_date = date(today.year, int(match.group(2)), int(match.group(1)))
                # Remove date from text
                text = re.sub(pattern, '', text).strip()
                break
            except ValueError:
                continue
    
    # Extract list keywords
    task_list = None
    if any(word in text_lower for word in ['work', 'office', 'job', 'meeting', 'project']):
        task_list = 'work'
    elif any(word in text_lower for word in ['personal', 'home', 'family', 'shopping', 'gym']):
        task_list = 'personal'
    
    # Remove priority and list keywords from title
    text = re.sub(r'\b(high|low|medium)\s+priority\b', '', text, flags=re.IGNORECASE).strip()
    text = re.sub(r'\bpriority\b', '', text, flags=re.IGNORECASE).strip()
    text = re.sub(r'\b(work|personal|office|home)\b', '', text, flags=re.IGNORECASE).strip()
    
    # Clean up title - remove extra commas and spaces
    title = re.sub(r',+', ',', text).strip()
    title = re.sub(r'\s+', ' ', title).strip()
    title = title.strip(',').strip()
    
    # If title is empty after cleaning, use original text
    if not title:
        title = text.strip()
    
    return NaturalLanguageParseResponse(
        title=title,
        description=None,
        status=TaskStatus.TODO,
        priority=priority,
        due_date=due_date,
        list=task_list
    )


@router.post("/parse-natural-language", response_model=NaturalLanguageParseResponse, status_code=status.HTTP_200_OK)
async def parse_natural_language_task(request: NaturalLanguageParseRequest):
    """
    Parse natural language text into structured task fields.
    
    Example request:
    {
        "text": "Call John tomorrow about the project proposal, high priority"
    }
    
    Example response:
    {
        "title": "Call John about the project proposal",
        "priority": "high",
        "due_date": "2024-12-19",
        "status": "todo"
    }
    """
    try:
        result = parse_natural_language(request.text)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse natural language: {str(e)}"
        )


@router.get("", response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
async def get_all_tasks():
    """Get all tasks from the database."""
    try:
        response = supabase.table("tasks").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tasks: {str(e)}"
        )


@router.get("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def get_task(task_id: str):
    """Get a single task by ID."""
    try:
        response = supabase.table("tasks").select("*").eq("id", task_id).execute()
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch task: {str(e)}"
        )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate):
    """Create a new task."""
    try:
        task_data = task.model_dump()
        if task_data.get("due_date"):
            task_data["due_date"] = str(task_data["due_date"])
        if task_data.get("subtasks") is None:
            task_data["subtasks"] = []
        response = supabase.table("tasks").insert(task_data).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create task - no data returned from database"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )


@router.put("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def update_task(task_id: str, task_update: TaskUpdate):
    """Update an existing task."""
    try:
        update_data = task_update.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields provided for update"
            )
        if update_data.get("due_date"):
            update_data["due_date"] = str(update_data["due_date"])
        if "subtasks" in update_data and update_data["subtasks"] is None:
            update_data["subtasks"] = []
        update_data["updated_at"] = datetime.utcnow().isoformat()
        response = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str):
    """Delete a task."""
    try:
        check_response = supabase.table("tasks").select("id").eq("id", task_id).execute()
        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        supabase.table("tasks").delete().eq("id", task_id).execute()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )
