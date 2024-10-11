import asyncio
import aiohttp
import random
import json
from datetime import datetime, timedelta
from config import SOLANA_RPC_URL


# Fetch recent transactions for a contract address and compare with DynamoDB (Async version)
async def fetch_recent_transactions(session, contract_address, dynamo_signatures):
    """
    Fetch the last 10 transaction signatures from Solana and compare them with DynamoDB.
    Only fetch unique transaction details.
    """
    headers = {"Content-Type": "application/json"}
    current_time = datetime.utcnow()
    one_minute_ago = current_time - timedelta(seconds=20000)

    # Fetch the last 10 transaction signatures from Solana
    payload = {
        "jsonrpc": "2.0",
        "id": str(random.randint(1, 10222220)),
        "method": "getSignaturesForAddress",
        "params": [contract_address, {"commitment":"finalized","limit": 10}]
    }

    async with session.post(SOLANA_RPC_URL, headers=headers, json=payload) as response:
        if response.status != 200:
            print(f"Error fetching signatures for {contract_address}: {response.status}")
            return []
        result = await response.json()
    
    recent_signatures = [tx['signature'] for tx in result.get('result', [])]

    # Compare recent signatures with the DynamoDB signatures
    dynamo_signatures_for_contract = dynamo_signatures.get(contract_address, [])
    unique_signatures = list(set(recent_signatures) - set(dynamo_signatures_for_contract))
    print(f"Unique signatures for {contract_address}: {unique_signatures}")

    # Fetch transaction details for unique signatures in parallel
    transactions = await get_transaction_details_parallel(session, unique_signatures, contract_address)

    return transactions


# Fetch bulk transaction details for unique signatures using async/await
async def get_transaction_details_parallel(session, signatures, contract_address):
    """
    Fetches transaction details in parallel using aiohttp and asyncio.
    """
    if not signatures:
        return []

    tasks = [fetch_transaction(session, signature) for signature in signatures]
    transaction_details = await asyncio.gather(*tasks)
    txs=[]
    for tx in transaction_details:
        if tx:
            tx["contract_address"]=contract_address
            txs.append(tx)
    return txs


# Async function to fetch transaction details for a single signature
async def fetch_transaction(session, signature):
    """
    Fetches transaction details for a single signature using the getTransaction API.
    This function is asynchronous and runs within the event loop.
    """
    headers = {"Content-Type": "application/json"}
    payload = {
        "jsonrpc": "2.0",
        "id": str(random.randint(1, 10222220)),
        "method": "getTransaction",
        "params": [signature, {"commitment":"finalized","encoding":"jsonParsed","maxSupportedTransactionVersion": 0}]
    }

    async with session.post(SOLANA_RPC_URL, headers=headers, json=payload) as response:
        if response.status != 200:
            print(f"Error fetching transaction for {signature}: {response.status}")
            return None
        data = await response.json()
        return data.get('result', None)

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