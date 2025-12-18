"""
Main FastAPI application for Task Manager backend.

This module sets up the FastAPI server, includes routers,
and handles CORS for frontend communication.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import tasks

# Initialize FastAPI application
app = FastAPI(
    title="Task Manager API",
    description="RESTful API for managing tasks",
    version="1.0.0"
)

# Configure CORS to allow frontend requests
# In production, replace "*" with specific frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (adjust for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include task router
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Task Manager API is running"}

