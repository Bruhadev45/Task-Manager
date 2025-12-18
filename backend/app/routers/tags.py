"""
Tags router - handles all tag-related API endpoints.
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from pydantic import BaseModel, Field
from app.database import supabase

router = APIRouter()


class TagCreate(BaseModel):
    """Model for creating a tag."""
    name: str = Field(..., min_length=1, max_length=100, description="Tag name")


class TagResponse(BaseModel):
    """Model for tag response."""
    id: str
    name: str
    created_at: str


@router.get("", response_model=List[TagResponse], status_code=status.HTTP_200_OK)
async def get_all_tags():
    """Get all tags from the database."""
    try:
        response = supabase.table("tags").select("*").order("name", desc=False).execute()
        return response.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tags: {str(e)}"
        )


@router.post("", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(tag_data: TagCreate):
    """Create a new tag."""
    try:
        name = tag_data.name.strip()
        if not name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tag name cannot be empty"
            )
        
        # Check if tag already exists
        existing = supabase.table("tags").select("*").eq("name", name).execute()
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tag '{name}' already exists"
            )
        
        response = supabase.table("tags").insert({"name": name}).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create tag - no data returned from database"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create tag: {str(e)}"
        )


@router.delete("/{tag_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(tag_name: str):
    """Delete a tag."""
    try:
        name = tag_name.strip()
        
        # Check if tag exists
        check_response = supabase.table("tags").select("id").eq("name", name).execute()
        if not check_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Tag '{name}' not found"
            )
        
        supabase.table("tags").delete().eq("name", name).execute()
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete tag: {str(e)}"
        )

