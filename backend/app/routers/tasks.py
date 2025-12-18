"""
Task router - handles all task-related API endpoints.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from app.database import supabase
from app.models import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter()


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
        if task_data.get("tags") is None:
            task_data["tags"] = []
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
        if "tags" in update_data and update_data["tags"] is None:
            update_data["tags"] = []
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
