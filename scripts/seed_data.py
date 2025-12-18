"""
Script to seed dummy data into Supabase database.
Run this script to automatically populate the database with sample tasks.

Usage:
    python scripts/seed_data.py
    
Or with environment variables:
    SUPABASE_URL=your_url SUPABASE_KEY=your_key python scripts/seed_data.py

Note: The tasks table must exist before running this script.
Run database/init.sql or database/schema.sql first.
"""

import os
import sys
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Get project root directory
PROJECT_ROOT = Path(__file__).parent.parent

# Load environment variables from backend/.env file
env_path = PROJECT_ROOT / "backend" / ".env"
load_dotenv(dotenv_path=env_path)

def get_supabase_client() -> Client:
    """Get Supabase client from environment variables or user input."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    # If not in environment, ask user
    if not supabase_url:
        supabase_url = input("Enter your Supabase URL: ").strip()
    
    if not supabase_key:
        supabase_key = input("Enter your Supabase Key (anon/public key): ").strip()
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_KEY are required")
        sys.exit(1)
    
    return create_client(supabase_url, supabase_key)

def create_table_if_not_exists(supabase: Client):
    """Create the tasks table if it doesn't exist."""
    print("📋 Checking if tasks table exists...")
    
    try:
        # Try to query the table to see if it exists
        result = supabase.table("tasks").select("id").limit(1).execute()
        print("✅ Tasks table already exists")
        return False
    except Exception as e:
        # Table doesn't exist, create it
        if "relation" in str(e).lower() and "does not exist" in str(e).lower():
            print("📝 Creating tasks table...")
            
            # Use Supabase's SQL execution (if available) or direct SQL
            # Note: Supabase Python client doesn't directly support CREATE TABLE
            # So we'll use the REST API to execute SQL
            from supabase import create_client
            
            # For now, we'll just inform the user
            print("⚠️  Table doesn't exist. Please create it first using:")
            print("   1. Go to Supabase SQL Editor")
            print("   2. Run the SQL from database/schema.sql")
            print("   3. Then run this script again")
            print("\nOr use database/QUICK_SETUP.sql which creates table + seeds data")
            
            return True
        else:
            raise e

def seed_data(supabase: Client):
    """Seed the database with dummy task data."""
    print("\n🌱 Seeding data...")
    
    # Sample tasks data with list assignments
    tasks = [
        # Work tasks
        {
            "title": "Complete project documentation",
            "description": "Write comprehensive documentation for the Task Manager application including API endpoints, setup instructions, and user guide.",
            "status": "in-progress",
            "priority": "high",
            "list": "work",
            "due_date": None  # Will be set to 2 days from now
        },
        {
            "title": "Fix critical bug in authentication",
            "description": "Users are unable to log in after the latest update. Need to investigate and fix immediately.",
            "status": "todo",
            "priority": "high",
            "list": "work",
            "due_date": None  # Will be set to 1 day from now
        },
        {
            "title": "Prepare presentation for client meeting",
            "description": "Create slides and demo materials for the upcoming client presentation on Friday.",
            "status": "in-progress",
            "priority": "high",
            "list": "work",
            "due_date": None  # Will be set to 3 days from now
        },
        {
            "title": "Review code pull requests",
            "description": "Review and provide feedback on 5 pending pull requests from the team.",
            "status": "todo",
            "priority": "medium",
            "list": "work",
            "due_date": None  # Will be set to 5 days from now
        },
        {
            "title": "Update dependencies",
            "description": "Check and update npm packages to latest stable versions. Run tests after updates.",
            "status": "todo",
            "priority": "medium",
            "list": "work",
            "due_date": None  # Will be set to 7 days from now
        },
        {
            "title": "Write unit tests for new features",
            "description": "Add comprehensive unit tests for the recently implemented search and filter functionality.",
            "status": "in-progress",
            "priority": "medium",
            "list": "work",
            "due_date": None  # Will be set to 4 days from now
        },
        {
            "title": "Optimize database queries",
            "description": "Review slow queries and add indexes where needed to improve performance.",
            "status": "todo",
            "priority": "medium",
            "list": "work",
            "due_date": None  # Will be set to 10 days from now
        },
        {
            "title": "Conduct performance reviews",
            "description": "Schedule and conduct one-on-one performance review meetings with all team members.",
            "status": "in-progress",
            "priority": "high",
            "list": "work",
            "due_date": None  # Will be set to 7 days from now
        },
        {
            "title": "Update company website",
            "description": "Refresh the company website with new content, images, and improved navigation.",
            "status": "todo",
            "priority": "low",
            "list": "work",
            "due_date": None  # Will be set to 20 days from now
        },
        {
            "title": "Setup development environment",
            "description": "Configure local development environment with all necessary tools and dependencies.",
            "status": "done",
            "priority": "high",
            "list": "work",
            "due_date": None  # Will be set to 5 days ago
        },
        {
            "title": "Design database schema",
            "description": "Create and implement the database schema for tasks with proper relationships and constraints.",
            "status": "done",
            "priority": "high",
            "list": "work",
            "due_date": None  # Will be set to 3 days ago
        },
        {
            "title": "Implement user authentication",
            "description": "Build authentication system with login, registration, and password reset functionality.",
            "status": "done",
            "priority": "medium",
            "list": "work",
            "due_date": None  # Will be set to 2 days ago
        },
        {
            "title": "Create landing page",
            "description": "Design and implement an attractive landing page with clear call-to-action buttons.",
            "status": "done",
            "priority": "medium",
            "list": "work",
            "due_date": None  # Will be set to 1 day ago
        },
        # Personal tasks
        {
            "title": "Plan team offsite event",
            "description": "Coordinate with team members to plan the quarterly team building event. Book venue and activities.",
            "status": "todo",
            "priority": "medium",
            "list": "personal",
            "due_date": None  # Will be set to 30 days from now
        },
        {
            "title": "Learn new framework",
            "description": "Spend time learning the latest version of the framework we plan to use in upcoming projects.",
            "status": "todo",
            "priority": "low",
            "list": "personal",
            "due_date": None
        },
        {
            "title": "Organize project files",
            "description": "Clean up and organize the project directory structure. Archive old files.",
            "status": "todo",
            "priority": "low",
            "list": "personal",
            "due_date": None  # Will be set to 14 days from now
        },
        {
            "title": "Research new UI libraries",
            "description": "Explore modern UI component libraries that could improve the user experience.",
            "status": "todo",
            "priority": "low",
            "list": "personal",
            "due_date": None
        },
        {
            "title": "Update README file",
            "description": "Add new features and improvements to the README documentation.",
            "status": "todo",
            "priority": "low",
            "list": "personal",
            "due_date": None  # Will be set to 21 days from now
        },
        # List 1 tasks
        {
            "title": "Grocery shopping",
            "description": "Buy ingredients for weekend cooking. Need vegetables, meat, and spices.",
            "status": "todo",
            "priority": "medium",
            "list": "list1",
            "due_date": None  # Will be set to 1 day from now
        },
        {
            "title": "Call dentist for appointment",
            "description": "Schedule annual dental checkup. Preferred time is next week.",
            "status": "todo",
            "priority": "low",
            "list": "list1",
            "due_date": None  # Will be set to 3 days from now
        },
        {
            "title": "Renew gym membership",
            "description": "Gym membership expires next month. Need to renew before it expires.",
            "status": "todo",
            "priority": "low",
            "list": "list1",
            "due_date": None  # Will be set to 15 days from now
        }
    ]
    
    # Set due dates using Python datetime
    from datetime import date, timedelta
    
    due_date_map = [
        # Work tasks
        2, 1, 3, 5, 7, 4, 10, 7, 20, -5, -3, -2, -1,
        # Personal tasks
        30, None, 14, None, 21,
        # List 1 tasks
        1, 3, 15
    ]
    
    for i, task in enumerate(tasks):
        if due_date_map[i] is not None:
            task["due_date"] = str(date.today() + timedelta(days=due_date_map[i]))
        else:
            task["due_date"] = None
    
    try:
        # Insert tasks in batches
        print(f"📝 Inserting {len(tasks)} tasks...")
        
        # Insert all tasks
        result = supabase.table("tasks").insert(tasks).execute()
        
        if result.data:
            print(f"✅ Successfully inserted {len(result.data)} tasks!")
            return True
        else:
            print("⚠️  No data returned from insert")
            return False
            
    except Exception as e:
        print(f"❌ Error inserting data: {str(e)}")
        return False

def verify_data(supabase: Client):
    """Verify the seeded data."""
    try:
        result = supabase.table("tasks").select("id, status, priority, list").execute()
        
        if result.data:
            total = len(result.data)
            statuses = {}
            priorities = {}
            lists = {}
            
            for task in result.data:
                status = task.get("status", "unknown")
                priority = task.get("priority", "unknown")
                list_name = task.get("list", "none")
                statuses[status] = statuses.get(status, 0) + 1
                priorities[priority] = priorities.get(priority, 0) + 1
                lists[list_name] = lists.get(list_name, 0) + 1
            
            print(f"\n📊 Verification:")
            print(f"   Total tasks: {total}")
            print(f"   By status: {statuses}")
            print(f"   By priority: {priorities}")
            print(f"   By list: {lists}")
            return True
        else:
            print("⚠️  No tasks found in database")
            return False
            
    except Exception as e:
        print(f"❌ Error verifying data: {str(e)}")
        return False

def main():
    """Main function to seed the database."""
    print("🚀 Task Manager - Data Seeding Script")
    print("=" * 50)
    
    # Get Supabase client
    supabase = get_supabase_client()
    
    # Check if table exists
    table_missing = create_table_if_not_exists(supabase)
    if table_missing:
        print("\n❌ Cannot proceed without the tasks table.")
        print("Please create the table first, then run this script again.")
        sys.exit(1)
    
    # Ask user if they want to clear existing data
    try:
        existing = supabase.table("tasks").select("id").limit(1).execute()
        if existing.data:
            response = input("\n⚠️  Tasks already exist. Clear existing data? (y/N): ").strip().lower()
            if response == 'y':
                print("🗑️  Clearing existing tasks...")
                supabase.table("tasks").delete().neq("id", "").execute()  # Delete all
                print("✅ Existing tasks cleared")
            else:
                print("ℹ️  Keeping existing tasks, adding new ones...")
    except:
        pass
    
    # Seed data
    if seed_data(supabase):
        # Verify
        verify_data(supabase)
        print("\n✅ Seeding complete!")
        print("🌐 You can now view your tasks at http://localhost:3000")
    else:
        print("\n❌ Seeding failed. Please check the error messages above.")
        sys.exit(1)

if __name__ == "__main__":
    main()

