import boto3

from config import DYNAMODB_TABLE, DYNAMODB_REGION

dynamodb = boto3.resource('dynamodb', region_name=DYNAMODB_REGION)
table = dynamodb.Table(DYNAMODB_TABLE)

# Fetch the last 50 transaction signatures for all contracts from DynamoDB
def fetch_all_signatures_from_dynamo():
    response = table.scan(Limit=50)
    
    # Create a dictionary of contract addresses mapped to their signatures
    signature_map = {}
    for item in response.get('Items', []):
        contract_address = item['contract_address']
        if contract_address not in signature_map:
            signature_map[contract_address] = []
        signature_map[contract_address].append(item['signature'])
    
    return signature_map
    
# Save processed transaction analysis to DynamoDB
def save_to_dynamodb(processed_results):
    for result in processed_results:
        table.put_item(
            Item={
                'timestamp': result["timestamp"],
                'contract_address': result['contract_address'], 
                'contract_name': result['contract_name'], 
                'signature': result['transaction_signature'],
                'score': result['score'],
                'analysis': result['analysis'],  # LLM Analysis
                'custom_detection': result['custom_detection'],  # Custom Detection
                'alert_status': result['alert_status']
            }
        )
