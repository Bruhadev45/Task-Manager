"""
Lists router - handles all custom list-related API endpoints.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from pydantic import BaseModel, Field
from app.database import supabase

router = APIRouter()


class ListCreate(BaseModel):
    """Model for creating a list."""
    name: str = Field(..., min_length=1, max_length=100, description="List name")


class ListResponse(BaseModel):
    """Model for list response."""
    id: str
    name: str
    created_at: str


@router.get("", response_model=List[ListResponse], status_code=status.HTTP_200_OK)
async def get_all_lists():
    """Get all custom lists from the database."""
    try:
        response = supabase.table("custom_lists").select("*").order("name", desc=False).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch lists: {str(e)}"
        )


@router.post("", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
async def create_list(list_data: ListCreate):
    """Create a new custom list."""
    try:
        name = list_data.name.strip().lower()
        if not name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="List name cannot be empty"
            )
        
        # Check if list already exists
        existing = supabase.table("custom_lists").select("*").eq("name", name).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"List '{name}' already exists"
            )
        
        response = supabase.table("custom_lists").insert({"name": name}).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create list - no data returned from database"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create list: {str(e)}"
        )


@router.delete("/{list_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_list(list_name: str):
    """Delete a custom list."""
    try:
        name = list_name.strip().lower()
        
        # Don't allow deleting default lists
        default_lists = ['personal', 'work', 'list1']
        if name in default_lists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete default list '{name}'"
            )
        
        # Check if list exists
        check_response = supabase.table("custom_lists").select("id").eq("name", name).execute()
        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"List '{name}' not found"
            )
        
        supabase.table("custom_lists").delete().eq("name", name).execute()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete list: {str(e)}"
        )

