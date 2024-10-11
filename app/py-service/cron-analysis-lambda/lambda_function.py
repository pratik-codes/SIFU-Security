import asyncio
import aiohttp
import json
from datetime import datetime, timezone
from transaction_fetcher import fetch_recent_transactions
from llm_analysis import LLMAnalysis
from custom_detection import run_custom_detection
from config import CONTRACT_ADDRESSES, CONTRACT_CONFIG_KEY, REVERSE_CONTRACT_CONFIG
from dynamo_storage import save_to_dynamodb, fetch_all_signatures_from_dynamo

def extract_contract_address(transaction_data):
    """
    Extract the contract address (dApp's address) from the accountKeys in transaction data.
    Typically, the contract is one of the public keys associated with writable accounts.
    """
    try:
        account_keys = transaction_data['transaction']['message']['accountKeys']

        # Loop through accountKeys to find the most relevant one (assuming writable, non-signing accounts)
        for account in account_keys:
            if not account.get('signer') and account.get('writable'):
                return account['pubkey']  # Return the first writable non-signer account
        
        # Fallback: if no writable, non-signer accounts are found
        return account_keys[0]['pubkey']  # Return the first pubkey as a fallback
    except KeyError:
        print("Error extracting contract address from transaction data")
        return None



def extract_timestamp(transaction_data):
    """
    Extracts and converts the blockTime (Unix timestamp) from the transaction data to a human-readable format.
    """
    block_time = transaction_data.get('blockTime', None)
    
    if block_time:
        # Convert Unix timestamp to human-readable datetime
        readable_time = datetime.utcfromtimestamp(block_time).strftime('%Y-%m-%d %H:%M:%S')
        return readable_time
    else:
        return datetime.now(timezone.utc).isoformat()

# Main Lambda handler (using asyncio event loop)
def lambda_handler(event, context):
    """
    AWS Lambda handler to fetch transactions for multiple contract addresses and run analysis.
    """
    # Fetch contract addresses from environment variables
    contract_addresses = CONTRACT_ADDRESSES.split(",")

    # Fetch the last 50 transactions from DynamoDB for all contracts
    dynamo_signatures = fetch_all_signatures_from_dynamo()

    # Create an async event loop to handle async I/O
    loop = asyncio.get_event_loop()

    # Use aiohttp for making async HTTP requests
    async def process_transactions():
        async with aiohttp.ClientSession() as session:
            tasks = [fetch_recent_transactions(session, contract_address, dynamo_signatures)
                     for contract_address in contract_addresses]
            
            # Execute all tasks concurrently
            results = await asyncio.gather(*tasks)

            transactions = []
            # Iterate through each result (transactions) and add contract details directly
            for txs in results:
                if txs:  # Check if txs is not empty
                    for tx in txs:
                        # Extract contract address from transaction data
                        
                        # Add contract name and address to the transaction
                        contract_address=tx["contract_address"]
                        tx["contract_name"] = REVERSE_CONTRACT_CONFIG.get(contract_address, "Jupiter")
                    transactions.extend(txs)

            if not transactions:
                return {
                    'statusCode': 200,
                    'body': json.dumps({'message': 'No transactions found in the last 60 seconds'})
                }

            # Send the transactions in batch to LLM for analysis
            llm_batch_results = LLMAnalysis().batch_analyze_with_llm(transactions)

            processed_results = []
            for result, transaction in zip(llm_batch_results, transactions):
                result["contract_name"] = transaction['contract_name']
                result["contract_address"] = transaction['contract_address']
                result["timestamp"]= extract_timestamp(transaction)
                
                # Perform custom detection on the transaction data
                custom_detection_result = run_custom_detection(transaction)

                # Add both LLM analysis and custom detection result
                result['custom_detection'] = custom_detection_result

                # Add result to processed data for storing
                processed_results.append(result)
            print("final result",processed_results)
            save_to_dynamodb(processed_results)



    # Run the async function and return the result
    loop.run_until_complete(process_transactions())


    return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Transactions processed and analyzed successfully'})
            }
