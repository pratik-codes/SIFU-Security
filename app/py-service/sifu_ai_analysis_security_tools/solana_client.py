# solana_client.py
"""
Module for interacting with the Solana RPC API.
"""

import requests
from config import SOLANA_RPC_ENDPOINT

class SolanaClient:
    def __init__(self, endpoint: str = SOLANA_RPC_ENDPOINT):
        self.endpoint = endpoint

    def get_account_info(self, account_address: str):
        """
        Fetch account information for a given address.
        """
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getAccountInfo",
            "params": [
                account_address,
                {"encoding": "jsonParsed"}
            ]
        }
        response = requests.post(self.endpoint, json=payload)
        return response.json()

    def get_transaction_history(self, account_address: str, limit: int = 5):
        """
        Fetch recent transaction signatures for a given address.
        """
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getConfirmedSignaturesForAddress2",
            "params": [
                account_address,
                {"limit": limit}
            ]
        }
        response = requests.post(self.endpoint, json=payload)
        return response.json()

    def get_transaction_details(self, tx_signature: str):
        """
        Fetch transaction details by transaction signature.
        """
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTransaction",
            "params": [
                tx_signature,
                {"maxSupportedTransactionVersion": 0, "encoding":"base64"}
            ]
        }
        response = requests.post(self.endpoint, json=payload)
        if response.status_code == 200:
            return response.json().get("result")
        else:
            raise RuntimeError("Failed to fetch transaction data")

    def simulate_transaction(self, transaction_data: dict):
        """
        Simulate a transaction on the Solana blockchain.
        """
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "simulateTransaction",
            "params": [
                transaction_data["transaction"][0],
                {"sigVerify": False, "commitment": "processed", "encoding":"base64", "replaceRecentBlockhash":True}
            ]
        }
        response = requests.post(self.endpoint, json=payload)
        if response.status_code == 200:
            return response.json().get("result")
        else:
            raise RuntimeError("Failed to simulate transaction")
