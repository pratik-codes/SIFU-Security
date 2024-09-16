# llm_analyzer.py
"""
Module for analyzing Solana contract, transaction, and code data using Google Gen AI.
"""
import random
import google.generativeai as genai
from config import LLM_API_KEY, LLM_MODEL_NAME, CONTRACT_ANALYSIS_PROMPT, TRANSACTION_ANALYSIS_PROMPT, CONTRACT_CODE_ANALYSIS_PROMPT

class LLMAnalyzer:
    def __init__(self, api_key: str = LLM_API_KEY):
        # Configure Google Gen AI with the provided API key
        genai.configure(api_key=random.choice(api_key))
        self.model_name = LLM_MODEL_NAME

    def analyze_contract(self, data: dict):
        """
        Send contract data to the LLM for analysis and return the result.
        """
        chat_session = genai.GenerativeModel(
            self.model_name,
            generation_config={
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
                "response_mime_type": "application/json",
            },
            system_instruction=CONTRACT_ANALYSIS_PROMPT,
        )

        # Call the LLM with the provided data
        response = chat_session.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [str(data)]
                }
            ]
        )

        return response.send_message("Please analyze the above contract data.").text

    def analyze_transaction(self, transaction_data: dict, simulation_data: dict):
        """
        Send transaction data and simulation result to the LLM for analysis and return the result.
        """
        chat_session = genai.GenerativeModel(
            self.model_name,
            generation_config={
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
                "response_mime_type": "application/json",
            },
            system_instruction=TRANSACTION_ANALYSIS_PROMPT,
        )

        # Combine transaction data and simulation data into a single input for the LLM
        input_data = f"Transaction Data:\n{transaction_data}\n"

        # Send the combined input to the LLM for analysis
        response = chat_session.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [input_data]
                }
            ]
        )

        return response.send_message("Analyze the transaction data and simulation result above.").text

    def analyze_contract_code(self, contract_code: str):
        """
        Send smart contract code to the LLM for analysis and return the result.
        """
        chat_session = genai.GenerativeModel(
            self.model_name,
            generation_config={
                "temperature": 1,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
                "response_mime_type": "application/json",
            },
            system_instruction=CONTRACT_CODE_ANALYSIS_PROMPT,
        )

        # Send the contract code to the LLM for analysis
        response = chat_session.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [contract_code]
                }
            ]
        )

        return response.send_message("Please analyze the smart contract code provided above.").text
