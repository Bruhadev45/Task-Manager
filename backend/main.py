"""
Main FastAPI application for Task Manager backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import tasks, lists, tags

app = FastAPI(
    title="Task Manager API",
    description="RESTful API for managing tasks",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(lists.router, prefix="/lists", tags=["lists"])
app.include_router(tags.router, prefix="/tags", tags=["tags"])


@app.get("/")
async def root():
    return {"message": "Task Manager API is running"}

