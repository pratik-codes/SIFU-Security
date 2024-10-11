# data_collector.py
"""
Module for collecting and formatting data for LLM analysis.
"""

from solana_client import SolanaClient

class DataCollector:
    def __init__(self, solana_client: SolanaClient):
        self.solana_client = solana_client

    def collect_data(self, contract_address: str):
        """
        Collect and format data from the Solana blockchain.
        """
        data = {}

        # Fetch contract account info
        account_info = self.solana_client.get_account_info(contract_address)
        data['account_info'] = account_info

        # Fetch transaction history
        transaction_history = self.solana_client.get_transaction_history(contract_address)
        data['transaction_history'] = transaction_history

        # Fetch detailed transaction data
        detailed_transactions = []
        for signature in transaction_history.get('result', []):
            tx_details = self.solana_client.get_transaction_details(signature['signature'])
            detailed_transactions.append(tx_details)
        data['detailed_transactions'] = detailed_transactions
        
        print(data)
        return data
