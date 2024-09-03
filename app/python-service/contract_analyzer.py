# contract_analyzer.py
"""
Module for orchestrating the contract analysis process.
"""

from solana_client import SolanaClient
from llm_analyzer import LLMAnalyzer
from data_collector import DataCollector

class ContractAnalyzer:
    def __init__(self):
        # Initialize components needed for contract analysis
        self.solana_client = SolanaClient()
        self.data_collector = DataCollector(self.solana_client)
        self.llm_analyzer = LLMAnalyzer()

    def analyze_contract(self, contract_address: str):
        """
        Analyze a Solana contract for potential malicious behavior.
        """
        # Step 1: Collect data from Solana blockchain
        try:
            collected_data = self.data_collector.collect_data(contract_address)
        except Exception as e:
            raise RuntimeError(f"Failed to collect data: {str(e)}")

        # Step 2: Analyze the collected data using LLM
        try:
            analysis_result = self.llm_analyzer.analyze_contract(collected_data)
        except Exception as e:
            raise RuntimeError(f"Failed to analyze data: {str(e)}")

        return analysis_result
