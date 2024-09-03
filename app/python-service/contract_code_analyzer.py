# contract_code_analyzer.py
"""
Module for analyzing Solana smart contract code for potential malicious behavior.
"""

from llm_analyzer import LLMAnalyzer

class ContractCodeAnalyzer:
    def __init__(self):
        # Initialize LLM analyzer
        self.llm_analyzer = LLMAnalyzer()

    def analyze_code(self, contract_code: str):
        """
        Analyze a Solana smart contract code for potential malicious behavior.
        """
        # Step 1: Analyze the contract code using LLM
        try:
            analysis_result = self.llm_analyzer.analyze_contract_code(contract_code)
        except Exception as e:
            raise RuntimeError(f"Failed to analyze contract code: {str(e)}")

        return analysis_result
