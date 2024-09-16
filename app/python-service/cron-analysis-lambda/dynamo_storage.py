import boto3
from datetime import datetime, timezone
from config import DYNAMODB_TABLE, DYNAMODB_REGION

dynamodb = boto3.resource('dynamodb', region_name=DYNAMODB_REGION)
table = dynamodb.Table(DYNAMODB_TABLE)

# Fetch the last 50 transaction signatures for all contracts from DynamoDB
def fetch_all_signatures_from_dynamo():
    response = table.scan(Limit=50)
    
    # Create a dictionary of contract addresses mapped to their signatures
    signature_map = {}
    for item in response.get('Items', []):
        contract_address = item['contract']
        if contract_address not in signature_map:
            signature_map[contract_address] = []
        signature_map[contract_address].append(item['signature'])
    
    return signature_map
    
# Save processed transaction analysis to DynamoDB
def save_to_dynamodb(processed_results):
    for result in processed_results:
        timestamp = datetime.now(timezone.utc).isoformat()
        table.put_item(
            Item={
                'timestamp': timestamp,
                'contract': result['transaction']['contract'],  # Store contract address
                'signature': result['transaction']['signature'],
                'analysis': result['transaction']['analysis'],  # LLM Analysis
                'custom_detection': result['transaction']['custom_detection'],  # Custom Detection
                'alert_status': result['transaction']['alert_status']
            }
        )
