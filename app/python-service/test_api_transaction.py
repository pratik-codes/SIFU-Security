import requests
from config import SOLANA_RPC_ENDPOINT

RPC_ENDPOINT = SOLANA_RPC_ENDPOINT

def get_transaction_data(tx_signature):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [
            tx_signature,
            {"maxSupportedTransactionVersion": 0, "encoding":"base64"}        ]
    }
    
    response = requests.post(RPC_ENDPOINT, json=payload)
    
    if response.status_code == 200:
        print("transaction data",response.json())
        result = response.json()["result"]
        if result:
            return result
        else:
            print("Transaction not found or it may be too old.")
            return None
    else:
        print("Failed to fetch transaction data")
        return None

def simulate_transaction(transaction_data):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "simulateTransaction",
        "params": [
            transaction_data["transaction"][0],
            {"sigVerify": False, "commitment": "processed","encoding":"base64","replaceRecentBlockhash":True}
        ]
    }
    response = requests.post(RPC_ENDPOINT, json=payload)
    
    if response.status_code == 200:
        result = response.json()["result"]
        if result:
            return result
        else:
            print("Simulation failed.")
            return None
    else:
        print("Failed to simulate transaction")
        return None

# Replace with your actual transaction signature
tx_signature = "2AKnN7V5MLD1fyauEWnvMo1dJiCoCUnHnKcmuTtjrNguK288ssULLZeJ9Rkdq8sLk6kENie4oShciRj45aK8AJZD"

# Fetch and simulate the transaction
transaction_data = get_transaction_data(tx_signature)

if transaction_data:
    simulation_result = simulate_transaction(transaction_data)
    
    if simulation_result:
        print("Simulation Result:", simulation_result)
    else:
        print("Failed to simulate transaction.")
