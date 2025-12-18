# AI Feature Implementation Example: Natural Language Task Creation

This is a complete example of how to implement the Natural Language Task Creation feature.

## Overview

This feature allows users to type tasks in natural language like:
- "Call John tomorrow about the project, high priority"
- "Finish the report by Friday"
- "Review code PR, medium priority, due next week"

And the AI will automatically parse it into structured task data.

## Backend Implementation

### 1. Add OpenAI to Requirements

```bash
# backend/requirements.txt
openai==1.3.0
```

### 2. Create AI Service

```python
# backend/app/services/__init__.py
# (Create this file if it doesn't exist)

# backend/app/services/ai_service.py
"""
AI service for natural language processing and task-related AI features.
"""

import openai
import os
import json
from typing import Dict, Optional
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")


def parse_natural_language_to_task(user_input: str) -> Dict:
    """
    Parse natural language input into structured task data.
    
    Args:
        user_input: Natural language description of the task
        
    Returns:
        Dictionary with task fields: title, description, status, priority, due_date
        
    Example:
        Input: "Call John tomorrow about the project proposal, high priority"
        Output: {
            "title": "Call John about the project proposal",
            "description": None,
            "status": "todo",
            "priority": "high",
            "due_date": "2025-01-19"  # tomorrow's date
        }
    """
    if not openai.api_key:
        raise ValueError("OPENAI_API_KEY not set in environment variables")
    
    # Create a prompt that instructs the AI to parse the task
    prompt = f"""Parse this task description into structured JSON format.

User input: "{user_input}"

Extract the following information:
1. title: The main task description (required, concise)
2. description: Any additional details (optional)
3. status: One of ["todo", "in-progress", "done"] (default: "todo")
4. priority: One of ["low", "medium", "high"] (default: "medium")
5. due_date: Date in YYYY-MM-DD format if mentioned, or null

Handle relative dates:
- "tomorrow" = tomorrow's date
- "next week" = 7 days from now
- "Friday" = next Friday
- "in 3 days" = 3 days from now

Return ONLY valid JSON, no other text.
Example format:
{{
    "title": "Call John about project proposal",
    "description": null,
    "status": "todo",
    "priority": "high",
    "due_date": "2025-01-19"
}}"""

    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that parses task descriptions into structured JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Lower temperature for more consistent parsing
            max_tokens=200
        )
        
        # Extract the JSON from the response
        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        # Parse JSON
        parsed_data = json.loads(content)
        
        # Validate and set defaults
        result = {
            "title": parsed_data.get("title", user_input).strip(),
            "description": parsed_data.get("description"),
            "status": parsed_data.get("status", "todo"),
            "priority": parsed_data.get("priority", "medium"),
            "due_date": parsed_data.get("due_date")
        }
        
        # Validate status and priority
        if result["status"] not in ["todo", "in-progress", "done"]:
            result["status"] = "todo"
        if result["priority"] not in ["low", "medium", "high"]:
            result["priority"] = "medium"
        
        # Validate due_date format
        if result["due_date"]:
            try:
                datetime.strptime(result["due_date"], "%Y-%m-%d")
            except ValueError:
                result["due_date"] = None
        
        return result
        
    except json.JSONDecodeError as e:
        # Fallback: create a simple task from the input
        return {
            "title": user_input,
            "description": None,
            "status": "todo",
            "priority": "medium",
            "due_date": None
        }
    except Exception as e:
        # If AI parsing fails, return a basic task structure
        return {
            "title": user_input,
            "description": None,
            "status": "todo",
            "priority": "medium",
            "due_date": None
        }


def suggest_task_priority(task_description: str) -> str:
    """
    Suggest priority based on task description.
    
    Args:
        task_description: The task title or description
        
    Returns:
        Suggested priority: "low", "medium", or "high"
    """
    if not openai.api_key:
        return "medium"  # Default if API key not set
    
    prompt = f"""Analyze this task and suggest a priority level (low, medium, or high).

Task: "{task_description}"

Consider:
- Urgency keywords (urgent, asap, critical, important)
- Task type (meeting, deadline, bug fix, feature)
- Time sensitivity

Return only one word: low, medium, or high"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=10
        )
        
        priority = response.choices[0].message.content.strip().lower()
        
        if priority in ["low", "medium", "high"]:
            return priority
        return "medium"
        
    except Exception:
        return "medium"  # Default on error
```

### 3. Add API Endpoint

```python
# backend/app/routers/tasks.py
# Add this new endpoint

@router.post("/parse", response_model=TaskCreate, status_code=status.HTTP_200_OK)
async def parse_natural_language(input_text: str = Body(..., embed=True)):
    """
    Parse natural language input into structured task data.
    
    This endpoint takes a natural language description and uses AI to extract
    task fields like title, priority, due date, etc.
    
    Args:
        input_text: Natural language task description
        
    Returns:
        TaskCreate model with parsed fields
        
    Example:
        POST /tasks/parse
        Body: {"input_text": "Call John tomorrow about project, high priority"}
    """
    try:
        from app.services.ai_service import parse_natural_language_to_task
        
        # Parse the natural language input
        parsed_data = parse_natural_language_to_task(input_text)
        
        # Convert to TaskCreate model
        task_create = TaskCreate(**parsed_data)
        
        return task_create
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to parse task: {str(e)}"
        )
```

### 4. Update Environment Variables

```bash
# backend/.env.example
# Add OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

## Frontend Implementation

### 1. Create Natural Language Input Component

```tsx
// frontend/components/NaturalLanguageInput.tsx
'use client'

import { useState } from 'react'
import { TaskCreate } from '@/types/task'

interface NaturalLanguageInputProps {
  onParse: (taskData: TaskCreate) => void
  onError: (error: string) => void
}

export default function NaturalLanguageInput({ onParse, onError }: NaturalLanguageInputProps) {
  const [input, setInput] = useState('')
  const [parsing, setParsing] = useState(false)

  const handleParse = async () => {
    if (!input.trim()) {
      onError('Please enter a task description')
      return
    }

    setParsing(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE_URL}/tasks/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input_text: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to parse task')
      }

      const taskData: TaskCreate = await response.json()
      onParse(taskData)
      setInput('') // Clear input after successful parse
    } catch (err) {
      onError('Failed to parse task. Please try again.')
      console.error('Error parsing task:', err)
    } finally {
      setParsing(false)
    }
  }

  return (
    <div style={{ marginBottom: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
        🤖 AI Task Parser (Try: "Call John tomorrow, high priority")
      </label>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleParse()}
          placeholder="Type your task in natural language..."
          style={{
            flex: 1,
            padding: '10px',
            border: '2px solid #e0e7ff',
            borderRadius: '8px',
            fontSize: '14px',
          }}
          disabled={parsing}
        />
        <button
          onClick={handleParse}
          disabled={parsing || !input.trim()}
          className="btn btn-primary"
        >
          {parsing ? 'Parsing...' : 'Parse'}
        </button>
      </div>
    </div>
  )
}
```

### 2. Integrate into Create Task Page

```tsx
// frontend/app/tasks/new/page.tsx
// Add the NaturalLanguageInput component

import NaturalLanguageInput from '@/components/NaturalLanguageInput'

// In the component:
const handleParse = (taskData: TaskCreate) => {
  // Pre-fill the form with parsed data
  setTitle(taskData.title)
  setDescription(taskData.description || '')
  setStatus(taskData.status)
  setPriority(taskData.priority)
  setDueDate(taskData.due_date || '')
  showToast('Task parsed successfully! Review and submit.', 'success')
}

// In JSX, add before the form:
<NaturalLanguageInput onParse={handleParse} onError={(err) => showToast(err, 'error')} />
```

## Usage Example

1. User types: "Call John tomorrow about the project proposal, high priority"
2. Clicks "Parse" button
3. Form auto-fills:
   - Title: "Call John about the project proposal"
   - Priority: High
   - Due Date: Tomorrow's date
   - Status: Todo
4. User reviews and submits

## Cost Estimation

- **GPT-3.5-turbo**: ~$0.002 per parse
- **1000 parses/month**: ~$2/month
- **Very affordable** for most applications

## Error Handling

The implementation includes fallbacks:
- If AI parsing fails, returns basic task structure
- If API key not set, returns default values
- User can always manually fill the form

## Next Steps

1. Get OpenAI API key from https://platform.openai.com
2. Add to `backend/.env`
3. Install OpenAI package: `pip install openai`
4. Test the endpoint
5. Add frontend component
6. Deploy!

