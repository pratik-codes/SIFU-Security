import json
from transaction_fetcher import fetch_recent_transactions
from llm_analysis import LLMAnalysis
from custom_detection import run_custom_detection
from config import CONTRACT_ADDRESSES, CONTRACT_CONFIG_KEY, REVERSE_CONTRACT_CONFIG
from dynamo_storage import save_to_dynamodb, fetch_all_signatures_from_dynamo

# Main Lambda handler
def lambda_handler(event, context):
    # Fetch contract addresses from event
    contract_addresses = CONTRACT_ADDRESSES.split(",")


    # Fetch the last 50 transactions from DynamoDB for all contracts
    dynamo_signatures = fetch_all_signatures_from_dynamo()
    
    print(dynamo_signatures,"dynamo_signatures")
    # Fetch transactions in batch for the last 60 seconds for each contract
    transactions = []
    for contract_address in contract_addresses:
        txs=fetch_recent_transactions(contract_address, dynamo_signatures)
        for tx in txs:
            tx["contract_name"] = REVERSE_CONTRACT_CONFIG.get(contract_address,"")
            tx["contract_address"]=contract_address
        transactions.extend(txs)

    if not transactions:
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'No transactions found in the last 60 seconds'})
        }
    # Send the transactions in batch to LLM for analysis
    llm_batch_results = LLMAnalysis().batch_analyze_with_llm(transactions)

    processed_results = []

    for result,transaction in zip(llm_batch_results,transactions):
        tx_signature = result['transaction_signature']
        contract_address = result['contract_address']
        result["contract_name"] = transaction['contract_name']
        
        # Perform custom detection on the transaction data
        custom_detection_result = run_custom_detection(transaction)

        # Add both LLM analysis and custom detection result
        result['custom_detection'] = custom_detection_result

        # Add result to processed data for storing
        processed_results.append(result)

    # Save processed results with both LLM and custom detection analysis to DynamoDB
    print(processed_results)
    # save_to_dynamodb(processed_results)

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Transactions processed and analyzed successfully'})
    }
