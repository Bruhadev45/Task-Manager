"""
Task router - handles all task-related API endpoints.

This module defines RESTful endpoints for CRUD operations on tasks:
- GET /tasks: List all tasks
- GET /tasks/{id}: Get a single task
- POST /tasks: Create a new task
- PUT /tasks/{id}: Update an existing task
- DELETE /tasks/{id}: Delete a task
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from app.database import supabase
from app.models import TaskCreate, TaskUpdate, TaskResponse
from datetime import datetime

router = APIRouter()


@router.get("", response_model=List[TaskResponse], status_code=status.HTTP_200_OK)
async def get_all_tasks():
    """
    Retrieve all tasks from the database.
    
    Returns:
        List of all tasks ordered by creation date (newest first)
    
    Raises:
        HTTPException: If database query fails
    """
    try:
        # Query all tasks from Supabase, ordered by creation date
        response = supabase.table("tasks").select("*").order("created_at", desc=True).execute()
        
        # Return the data if successful
        return response.data
    except Exception as e:
        # Log error and return 500 status
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tasks: {str(e)}"
        )


@router.get("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK)
async def get_task(task_id: str):
    """
    Retrieve a single task by its ID.
    
    Args:
        task_id: UUID of the task to retrieve
    
    Returns:
        Task object if found
    
    Raises:
        HTTPException: If task not found or query fails
    """
    try:
        # Query task by ID
        response = supabase.table("tasks").select("*").eq("id", task_id).execute()
        
        # Check if task exists
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        
        return response.data[0]
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        # Handle other errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch task: {str(e)}"
        )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate):
    """
    Create a new task in the database.
    
    Args:
        task: TaskCreate model with task data (validated by Pydantic)
    
    Returns:
        Created task object with generated ID and timestamps
    
    Raises:
        HTTPException: If task creation fails
    """
    try:
        # Convert Pydantic model to dictionary format for Supabase
        task_data = task.model_dump()
        
        # Supabase expects date as string, so convert if present
        if task_data.get("due_date"):
            task_data["due_date"] = str(task_data["due_date"])
        
        # Ensure subtasks is a list (can be None or empty list)
        if task_data.get("subtasks") is None:
            task_data["subtasks"] = []
        
        # Insert the new task into the database
        response = supabase.table("tasks").insert(task_data).execute()
        
        # Check if insertion was successful and return the created task
        if response.data and len(response.data) > 0:
            return response.data[0]
        else:
            # If no data returned, something went wrong
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
    """
    Update an existing task.
    
    Args:
        task_id: UUID of the task to update
        task_update: TaskUpdate model with fields to update (only provided fields will be updated)
    
    Returns:
        Updated task object
    
    Raises:
        HTTPException: If task not found or update fails
    """
    try:
        # Convert Pydantic model to dictionary, only including fields that were provided
        # exclude_unset=True means we only update fields that were actually sent
        update_data = task_update.model_dump(exclude_unset=True)
        
        # Validate that at least one field was provided for update
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields provided for update"
            )
        
        # Convert date to string format if present (Supabase requirement)
        if update_data.get("due_date"):
            update_data["due_date"] = str(update_data["due_date"])
        
        # Ensure subtasks is a list if provided (can be None or empty list)
        if "subtasks" in update_data and update_data["subtasks"] is None:
            update_data["subtasks"] = []
        
        # Update the timestamp to track when the task was last modified
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update the task in the database where id matches
        response = supabase.table("tasks").update(update_data).eq("id", task_id).execute()
        
        # Check if the task was found and successfully updated
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        
        # Return the updated task data
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
    """
    Delete a task from the database.
    
    Args:
        task_id: UUID of the task to delete
    
    Raises:
        HTTPException: If task not found or deletion fails
    """
    try:
        # First check if task exists
        check_response = supabase.table("tasks").select("id").eq("id", task_id).execute()
        
        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with id {task_id} not found"
            )
        
        # Delete the task
        supabase.table("tasks").delete().eq("id", task_id).execute()
        
        # Return 204 No Content on success
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )

