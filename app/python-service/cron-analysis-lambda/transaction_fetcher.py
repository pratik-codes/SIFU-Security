import requests
from datetime import datetime, timedelta
from config import SOLANA_RPC_URL

# Fetch recent transactions for a contract address and compare with DynamoDB
def fetch_recent_transactions(contract_address, dynamo_signatures):
    headers = {"Content-Type": "application/json"}
    current_time = datetime.utcnow()
    one_minute_ago = current_time - timedelta(seconds=20000)

    # Fetch last 10 transaction signatures from Solana
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getSignaturesForAddress",
        "params": [contract_address, {"limit": 10}]
    }

    response = requests.post(SOLANA_RPC_URL, headers=headers, json=payload)
    if response.status_code != 200:
        return []

    recent_signatures = [tx['signature'] for tx in response.json().get('result', [])]

    # Compare recent signatures with the DynamoDB signatures
    dynamo_signatures_for_contract = dynamo_signatures.get(contract_address, [])
    unique_signatures = list(set(recent_signatures) - set(dynamo_signatures_for_contract))

    # Fetch transaction details for unique signatures
    transactions = get_bulk_transaction_details(unique_signatures)
    
    return transactions



def get_bulk_transaction_details(signatures):
    """
    Fetches transaction details for a list of signatures in one call.
    """
    headers = {"Content-Type": "application/json"}

    # Prepare a batch request for all signatures
    payload = [
        {
            "jsonrpc": "2.0",
            "id": idx + 1,
            "method": "getConfirmedTransaction",
            "params": [signature, "jsonParsed"]
        }
        for idx, signature in enumerate(signatures)
    ]

    response = requests.post(SOLANA_RPC_URL, headers=headers, json=payload)
    
    # Check if the request was successful
    if response.status_code != 200:
        print(response.text)
        return []
    
    # Extract the results from the batch response
    transaction_details = [res.get('result', None) for res in response.json()]
    
    print(transaction_details,len(transaction_details))
    # Return only valid transaction details
    return [tx for tx in transaction_details if tx]

def get_first_transaction_time(wallet_pubkey):
    """Query Solana RPC to get the time of the first transaction for a given wallet."""
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getSignaturesForAddress",
        "params": [
            wallet_pubkey,
            {"limit": 1, "before": None, "until": None}  # Fetch the earliest transaction
        ]
    }
    
    try:
        response = requests.post(SOLANA_RPC_URL, headers=headers, json=payload)
        result = response.json().get('result', [])
        
        if result and 'blockTime' in result[0]:
            # Convert block time (Unix timestamp) to datetime
            first_transaction_time = datetime.utcfromtimestamp(result[0]['blockTime'])
            return first_transaction_time
    
    except Exception as e:
        print(f"Error fetching transaction data for wallet {wallet_pubkey}: {e}")
    
    return None