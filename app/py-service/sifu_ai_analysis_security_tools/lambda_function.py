# lambda_function.py
"""
AWS Lambda function entry point for multiple functionalities.
"""
import json
import traceback
import boto3
from datetime import datetime, timedelta
from boto3.dynamodb.conditions import Key
from utills import is_valid_contract_address, is_valid_signature
from config import RATE_LIMIT, TIME_PERIOD, DYNAMODB_REGION, DYNAMODB_TABLE
from contract_analyzer import ContractAnalyzer
from transaction_analyzer import TransactionAnalyzer
from contract_code_analyzer import ContractCodeAnalyzer
from mock_data import mock_solana_transaction_signature, mock_solana_contract_address, mock_solana_contract_code
from mock_data import mock_solana_transaction_signature_response, mock_solana_contract_address_response, mock_solana_contract_code_response


# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb', region_name=DYNAMODB_REGION)
table = dynamodb.Table(DYNAMODB_TABLE)

def get_current_timestamp():
	return int(datetime.utcnow().timestamp())

def is_within_rate_limit(user_ip):
    current_time = get_current_timestamp()
    
    # Fetch the item from DynamoDB using the partition key 'hash'
    response = table.get_item(Key={'hash': user_ip})  # 'hash' is your partition key
    
    if 'Item' in response:
        user_data = response['Item']
        request_count = user_data['request_count']
        last_request_time = user_data['last_request_time']
        
        if current_time - last_request_time >= TIME_PERIOD:
            # Reset the request count and update the last request time
            table.put_item(Item={
                'hash': user_ip,  # Partition key
                'request_count': 1,
                'last_request_time': current_time
            })
            return True
        else:
            if request_count < RATE_LIMIT:
                # Increment the request count
                table.update_item(
                    Key={'hash': user_ip},  # Partition key
                    UpdateExpression='SET request_count = request_count + :val, last_request_time = :time',
                    ExpressionAttributeValues={
                        ':val': 1,
                        ':time': current_time
                    }
                )
                return True
            else:
                return False
    else:
        # No item found, initialize the count
        table.put_item(Item={
            'hash': user_ip,  # Partition key
            'request_count': 1,
            'last_request_time': current_time
        })
        return True


def analyze_contract_handler(event, context):
	"""
	Lambda function handler to analyze a Solana contract by its address.
	"""
	contract_address = event.get('contract_address')
	if not contract_address or not is_valid_contract_address(contract_address):
		return {
			"statusCode": 400,
			"body": "Valid Contract address is required."
		}
	elif contract_address==mock_solana_contract_address:
		return {
			"statusCode": 200,
			"body": json.dumps(mock_solana_contract_address_response)
		}


	# Initialize ContractAnalyzer
	analyzer = ContractAnalyzer()

	# Perform the analysis
	try:
		analysis_result = analyzer.analyze_contract(contract_address)
	except Exception as e:
		return {
			"statusCode": 500,
			"body": f"Contract analysis failed: {str(e)}"
		}

	return {
		"statusCode": 200,
		"body": analysis_result
	}

def analyze_transaction_handler(event, context):
	"""
	Lambda function handler to analyze a Solana transaction by its signature.
	"""
	tx_signature = event.get('tx_signature')
	if not tx_signature or not is_valid_signature(tx_signature):
		return {
			"statusCode": 400,
			"body": "Valid Transaction signature is required."
		}
	elif tx_signature==mock_solana_transaction_signature:
		return {
			"statusCode": 200,
			"body": json.dumps(mock_solana_transaction_signature_response)
		}


	# Initialize TransactionAnalyzer
	analyzer = TransactionAnalyzer()

	# Perform the analysis
	try:
		analysis_result = analyzer.analyze_transaction(tx_signature)
	except Exception as e:
		return {
			"statusCode": 500,
			"body": f"Transaction analysis failed: {str(e)}"
		}

	return {
		"statusCode": 200,
		"body": analysis_result
	}

def analyze_contract_code_handler(event, context):
	"""
	Lambda function handler to analyze a Solana smart contract code.
	"""
	contract_code = event.get('contract_code')
	if not contract_code:
		return {
			"statusCode": 400,
			"body": "Smart contract code is required."
		}
	elif contract_code == mock_solana_contract_code:
		print("using mock for mock_solana_contract_code_response ")
		return {
			"statusCode": 200,
			"body": json.dumps(mock_solana_contract_code_response)
		}

	# Initialize ContractCodeAnalyzer
	analyzer = ContractCodeAnalyzer()

	# Perform the analysis
	try:
		analysis_result = analyzer.analyze_code(contract_code)
	except Exception as e:
		return {
			"statusCode": 500,
			"body": f"Contract code analysis failed: {str(e)}"
		}

	return {
		"statusCode": 200,
		"body": analysis_result
	}

def lambda_handler(event, context):
	"""
	Main Lambda function handler to route requests to the appropriate function.
	"""
	try:
		user_ip = event.get("requestContext").get("identity").get("sourceIp")
		print(event)
		if isinstance(event.get('body'), str):
			event=json.loads(event["body"])

		
		action = event.get('action')
		# Check if the user is within the rate limit
		print(action,user_ip)
		rate_limit_check = is_within_rate_limit(user_ip)
		print(user_ip,rate_limit_check)
		if not rate_limit_check:
			return {
				"statusCode": 429,  # Too Many Requests
				"body": "Rate limit exceeded. Please try again later."
			}
		if action == "analyze_contract":
			return analyze_contract_handler(event, context)
		elif action == "analyze_transaction":
			return analyze_transaction_handler(event, context)
		elif action == "analyze_contract_code":
			return analyze_contract_code_handler(event, context)
		else:
			return {
				"statusCode": 400,
				"body": "Invalid action specified."
		}
	except Exception as e:
		return {
				"statusCode": 500,
				"body": "Error{} and traceback{} ".format(e,traceback.format_exc())
		}

# Example of how to manually test the function
if __name__ == "__main__":
	test_event = {
		"contract_code": mock_solana_contract_code,
		"action": "analyze_contract_code"
	}
	test_event_2 = {
		"contract_address": "984GBL7PhceChtN64NWLdBb49rSQXX7ozpdkEbR1pump",
		"action": "analyze_contract"
	}
	test_event_4 = {
		"contract_address": "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
		"action": "analyze_contract"
	}
	test_event_3 = {
		"tx_signature": "2AKnN7V5MLD1fyauEWnvMo1dJiCoCUnHnKcmuTtjrNguK288ssULLZeJ9Rkdq8sLk6kENie4oShciRj45aK8AJZD",
		"action": "analyze_transaction"
	}
	test_event_5 = {
		"tx_signature": "2AKnN7V5MLD1fyauEWnvMo1dJiCoCUnHnKcmuTtjrNguK288ssULLZeJ9Rkdq8sLk6kENie4oShciRj45aK8AJZD",
		"action": "analyze_transaction"
	}
	# import pdb;pdb.set_trace()
	# print(analyze_contract_code_handler(test_event, None),"\n")
	print(analyze_contract_handler(test_event_2, None),"\n")
	print(analyze_transaction_handler(test_event_3, None),"\n")
	print(analyze_contract_handler(test_event_4, None),"\n")
	print(analyze_transaction_handler(test_event_5, None),"\n")



