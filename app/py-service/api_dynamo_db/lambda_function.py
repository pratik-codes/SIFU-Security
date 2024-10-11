import boto3
import json
from boto3.dynamodb.conditions import Key
from decimal import Decimal
import logging
from datetime import datetime
from config import CONTRACTS

# Initialize logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamo = boto3.resource('dynamodb')

# Helper function to convert Decimal to int/float
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError

# Standard response structure
def respond(status_code, body):
    return {
        'statusCode': status_code,
        'body': json.dumps(body, default=decimal_default),
        'headers': {
            'Content-Type': 'application/json',
        },
    }

# Function to query DynamoDB for a specific contract and timestamp
def query_contract_by_timestamp(table, contract_name, timestamp):
    try:
        response = table.query(
            KeyConditionExpression=Key('contract_name').eq(contract_name) & Key('timestamp').gte(timestamp),
            ScanIndexForward=False  # Sort descending
        )
        return response['Items']
    except Exception as e:
        logger.error(f"Error querying DynamoDB for {contract_name}: {str(e)}")
        raise Exception(f"Error querying DynamoDB for {contract_name}: {str(e)}")

# Function to validate and convert timestamp from string to datetime object
def parse_timestamp(timestamp_str):
    try:
        # Adjust format to match: 'YYYY-MM-DD HH:MM:SS'
        return datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        raise ValueError("Invalid timestamp format. Expected format: 'YYYY-MM-DD HH:MM:SS'")
        
# Function to filter unique signatures
def filter_unique_signatures(items):
    unique_signatures = set()
    unique_items = []
    
    for item in items:
        signature = item.get('signature')
        if signature not in unique_signatures:
            unique_signatures.add(signature)
            unique_items.append(item)
    
    return unique_items

# Lambda handler function
def lambda_handler(event, context):
    try:
        query_params = event.get('queryStringParameters', {})
        contract_name = query_params.get('contract_name')
        timestamp_str = query_params.get('timestamp')
        
        if not timestamp_str:
            return respond(400, {"error": "Timestamp is required."})

        # Validate and parse the timestamp
        try:
            timestamp = parse_timestamp(timestamp_str)  # Convert to datetime
        except ValueError as ve:
            return respond(400, {"error": str(ve)})

        # Convert the datetime object back to string or other format as per DynamoDB schema
        # If DynamoDB stores the timestamp as string in 'YYYY-MM-DD HH:MM:SS' format, keep it as is.
        # If it stores as Unix time, convert like so: timestamp = int(timestamp.timestamp())
        
        # Connect to the DynamoDB table
        table = dynamo.Table('SolanaTransactionAnalysis')

        # If contract_name is not provided, query all contracts
        if not contract_name:
            logger.info(f"Querying all contracts since timestamp: {timestamp_str}")
            contracts = CONTRACTS
            combined_results = []

            for contract in contracts:
                combined_results.extend(query_contract_by_timestamp(table, contract, timestamp_str))

            # Sort combined results by 'timestamp' field (descending order)
            unique_results = filter_unique_signatures(combined_results)
            sorted_results = sorted(unique_results, key=lambda x: x['timestamp'], reverse=True)

            return respond(200, sorted_results)

        # If contract_name is provided, query only for that contract
        logger.info(f"Querying contract: {contract_name} since timestamp: {timestamp_str}")
        results = query_contract_by_timestamp(table, contract_name, timestamp_str)
        unique_results = filter_unique_signatures(results)
        return respond(200, unique_results)

    except Exception as e:
        logger.error(f"Lambda function error: {str(e)}")
        return respond(500, {"error": f"Internal server error: {str(e)}"})

