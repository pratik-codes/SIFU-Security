# config.py
"""
Configuration settings for the Solana contract analyzer.
"""

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Fetch the configuration from environment variables
SOLANA_RPC_ENDPOINT = os.getenv("SOLANA_RPC_ENDPOINT")
LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME")  
LLM_API_KEY = os.getenv("LLM_API_KEY")  # API key for  Gen AI

CONTRACT_ANALYSIS_PROMPT=""
TRANSACTION_ANALYSIS_PROMPT=""
CONTRACT_CODE_ANALYSIS_PROMPT=""

# Optional: Set default values if environment variables are not set
if SOLANA_RPC_ENDPOINT is None:
    raise ValueError("SOLANA_RPC_ENDPOINT is not set in the environment variables")

if LLM_API_KEY is None:
    raise ValueError("LLM_API_KEY is not set in the environment variables")

if CONTRACT_ANALYSIS_PROMPT is None:
    raise ValueError("CONTRACT_ANALYSIS_PROMPT is not set in the environment variables")

if TRANSACTION_ANALYSIS_PROMPT is None:
    raise ValueError("TRANSACTION_ANALYSIS_PROMPT is not set in the environment variables")

if CONTRACT_CODE_ANALYSIS_PROMPT is None:
    raise ValueError("CONTRACT_CODE_ANALYSIS_PROMPT is not set in the environment variables")
