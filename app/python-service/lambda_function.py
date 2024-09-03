# lambda_function.py
"""
AWS Lambda function entry point for multiple functionalities.
"""
import json


from contract_analyzer import ContractAnalyzer
from transaction_analyzer import TransactionAnalyzer
from contract_code_analyzer import ContractCodeAnalyzer
from mock_data import mock_solana_transaction_signature, mock_solana_contract_address, mock_solana_contract_code
from mock_data import mock_solana_transaction_signature_response, mock_solana_contract_address_response, mock_solana_contract_code_response

def analyze_contract_handler(event, context):
    """
    Lambda function handler to analyze a Solana contract by its address.
    """
    contract_address = event.get('contract_address')
    if not contract_address:
        return {
            "statusCode": 400,
            "body": "Contract address is required."
        }
    elif contract_address==mock_solana_contract_address:
        return mock_solana_contract_address_response

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
    if not tx_signature:
        return {
            "statusCode": 400,
            "body": "Transaction signature is required."
        }
    elif tx_signature==mock_solana_transaction_signature:
        return mock_solana_transaction_signature_response


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
        return mock_solana_contract_code_response

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
    if isinstance(event.get('body'), str):
        event=json.loads(event["body"])

    action = event.get('action')

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
    test_event_3 = {
        "tx_signature": "2AKnN7V5MLD1fyauEWnvMo1dJiCoCUnHnKcmuTtjrNguK288ssULLZeJ9Rkdq8sLk6kENie4oShciRj45aK8AJZD",
        "action": "analyze_transaction"
    }
    # import pdb;pdb.set_trace()
    result = [lambda_handler(test_event, None),lambda_handler(test_event_2, None),
    lambda_handler(test_event_3, None)]

    print(result)

