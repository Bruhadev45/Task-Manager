"""
Pydantic models for request/response validation.

These models ensure data integrity and provide automatic
validation for API requests and responses.
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


class TaskList(str, Enum):
    """Valid task list values (for reference only - custom lists are now supported)."""
    PERSONAL = "personal"
    WORK = "work"
    LIST1 = "list1"


class NaturalLanguageParseRequest(BaseModel):
    """Model for natural language task parsing request."""
    text: str = Field(..., min_length=1, max_length=500, description="Natural language task description")


class NaturalLanguageParseResponse(BaseModel):
    """Model for natural language task parsing response."""
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[date] = None
    list: Optional[str] = None


class TaskBase(BaseModel):
    """
    Base task model with common fields shared by create and response models.
    
    This model defines the core structure of a task with validation rules.
    """
    # Title is required and must be between 1-200 characters
    title: str = Field(..., min_length=1, max_length=200, description="Task title")
    
    # Description is optional but limited to 1000 characters if provided
    description: Optional[str] = Field(None, max_length=1000, description="Task description")
    
    # Status defaults to 'todo' if not specified
    status: TaskStatus = Field(default=TaskStatus.TODO, description="Task status")
    
    # Priority defaults to 'medium' if not specified
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority")
    
    # Due date is optional - tasks can be created without a deadline
    due_date: Optional[date] = Field(None, description="Task due date")
    
    # List is optional - tasks can belong to any list (default lists or custom lists)
    # Changed from TaskList enum to str to support custom lists
    list: Optional[str] = Field(None, max_length=100, description="Task list (can be default or custom)")
    
    # Subtasks are optional - stored as JSON array
    subtasks: Optional[List[dict]] = Field(None, description="List of subtasks")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        """
        Validate that title is not empty after removing whitespace.
        
        This ensures users can't create tasks with just spaces.
        """
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()


class TaskCreate(TaskBase):
    """Model for creating a new task."""
    pass


class TaskUpdate(BaseModel):
    """Model for updating an existing task (all fields optional)."""
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
    """Model for task response (includes database fields)."""
    id: str
    created_at: str
    updated_at: str

    class Config:
        """Pydantic config for response model."""
        from_attributes = True
