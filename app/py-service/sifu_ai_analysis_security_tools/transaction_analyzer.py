# transaction_analyzer.py
"""
Module for orchestrating the transaction analysis process.
"""

from solana_client import SolanaClient
from llm_analyzer import LLMAnalyzer

class TransactionAnalyzer:
    def __init__(self):
        # Initialize Solana client and LLM analyzer
        self.solana_client = SolanaClient()
        self.llm_analyzer = LLMAnalyzer()

    def analyze_transaction(self, tx_signature: str):
        """
        Analyze a Solana transaction for potential malicious behavior.
        """
        # Step 1: Fetch transaction details from Solana blockchain
        try:
            transaction_data = self.solana_client.get_transaction_details(tx_signature)
        except Exception as e:
            raise RuntimeError(f"Failed to fetch transaction data: {str(e)}")

        # Step 2: Simulate the transaction
        try:
            simulation_result = self.solana_client.simulate_transaction(transaction_data)
        except Exception as e:
            raise RuntimeError(f"Failed to simulate transaction: {str(e)}")

        # Step 3: Analyze the transaction using LLM
        try:
            analysis_result = self.llm_analyzer.analyze_transaction(transaction_data, simulation_result)
        except Exception as e:
            raise RuntimeError(f"Failed to analyze transaction data: {str(e)}")

        return analysis_result
