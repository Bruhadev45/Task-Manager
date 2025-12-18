"""
Pydantic models for request/response validation.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date
from enum import Enum


class TaskStatus(str, Enum):
    """Valid task status values."""
    TODO = "todo"
    IN_PROGRESS = "in-progress"
    DONE = "done"


class TaskPriority(str, Enum):
    """Valid task priority values."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskBase(BaseModel):
    """Base task model with common fields."""
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=1000, description="Task description")
    status: TaskStatus = Field(default=TaskStatus.TODO, description="Task status")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority")
    due_date: Optional[date] = Field(None, description="Task due date")
    list: Optional[str] = Field(None, max_length=100, description="Task list")
    subtasks: Optional[List[dict]] = Field(None, description="List of subtasks")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        """Validate that title is not empty."""
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()


class TaskCreate(TaskBase):
    """Model for creating a task."""
    pass


class TaskUpdate(BaseModel):
    """Model for updating a task (all fields optional)."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[date] = None
    list: Optional[str] = Field(None, max_length=100, description="Task list (can be default or custom)")
    subtasks: Optional[List[dict]] = Field(None, description="List of subtasks")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        """Ensure title is not empty if provided."""
        if v is not None and not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip() if v else None


class TaskResponse(TaskBase):
    """Model for task response."""
    id: str
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
