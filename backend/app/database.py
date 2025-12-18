"""
Database connection module using Supabase client.

This module initializes and exports the Supabase client
for use across the application.
"""

from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get Supabase credentials from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Validate that required environment variables are set
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError(
        "SUPABASE_URL and SUPABASE_KEY must be set in environment variables"
    )

# Initialize Supabase client
# This client will be used for all database operations
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

