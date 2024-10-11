
import requests
from solana.rpc.api import Client
from solana.transaction import Transaction, Signature
from solders.transaction import VersionedTransaction, Presigner
from solders.hash import Hash
from solders.message import MessageV0
from solders.pubkey import Pubkey
import openai
import json
import base64
from config import SOLANA_RPC_ENDPOINT
# Initialize Solana client
rpc_url= SOLANA_RPC_ENDPOINT
solana_client = Client(rpc_url)


# def get_solana_transaction(tx_signature, rpc_url=rpc_url):
# 	headers = {"Content-Type": "application/json"}
# 	payload = {
# 		"jsonrpc": "2.0",
# 		"id": 1,
# 		"method": "getTransaction",
# 		"params": [tx_signature, "json", {"maxSupportedTransactionVersion": 0},
# ]
# 	}
	
# 	response = requests.post(rpc_url, headers=headers, json=payload)
# 	print(response.text)
# 	if response.status_code == 200:
# 		return response.json()
# 	else:
		# response.raise_for_status()

def get_transaction_details(tx_signature):
	# Convert the string to a Signature object
	tx_signature = Signature.from_string(tx_signature)
	tx_data = solana_client.get_transaction(tx_signature,encoding='base64',max_supported_transaction_version=0)
	# import pdb;pdb.set_trace()

	tx_data=json.loads(tx_data.to_json())

	return tx_data["result"]



# def simulate_transaction_api(raw_transaction):
#     headers = {"Content-Type": "application/json"}
#     payload = {
#         "jsonrpc": "2.0",
#         "id": 1,
#         "method": "simulateTransaction",
#         "params": [
#             raw_transaction,
#             {"encoding": "base64"}
#         ]
#     }

#     response = requests.post(rpc_url, headers=headers, json=payload)
#     return response.json()



def simulate_transaction(transaction):
	simulation = solana_client.simulate_transaction(transaction)
	if 'value' in simulation and simulation['value']:
		return simulation['value']


def analyze_transaction(tx_signature):
	transaction_details = get_transaction_details(tx_signature)
	# transaction_details=get_solana_transaction(tx_signature)


	# Normally, you'd construct this from the transaction details
	raw_transaction = transaction_details["transaction"][0]
	# transaction = Transaction.deserialize(raw_transaction)
	print(raw_transaction)
	transaction_bytes = base64.b64decode(raw_transaction)
	transaction = VersionedTransaction.from_bytes(transaction_bytes)

	# transaction.message.recent_blockhash = transaction_details["slot"]

	# simulation_result = solana_client.simulate_transaction(transaction)

	latest_blockhash = json.loads(solana_client.get_latest_blockhash().to_json())["result"]["value"]["blockhash"]

	# Convert the new blockhash to a Hash object
	new_blockhash = Hash.from_string(latest_blockhash)

	# Create a new MessageV0 with the updated blockhash
	new_message = MessageV0(
		recent_blockhash=new_blockhash,
		instructions=transaction.message.instructions,
		account_keys=transaction.message.account_keys,
		header=transaction.message.header,
		address_table_lookups=transaction.message.address_table_lookups,
	)

	# Extract signatures and corresponding public keys to create Presigner objects
	presigners = []
	for pubkey, signature in zip(transaction.message.account_keys, transaction.signatures):
		presigner = Presigner(Pubkey.from_bytes(pubkey.to_bytes()), signature)
		presigners.append(presigner)

	# Reconstruct the VersionedTransaction with the new message and presigned signatures
	new_transaction = VersionedTransaction(new_message, presigners)
	# Simulate the transaction with the new blockhash
	simulation_result = solana_client.simulate_transaction(new_transaction)

	print(transaction_details, "transaction_details")
	print(simulation_result, "simulation_result")

# Example usage
tx_signature = "2AKnN7V5MLD1fyauEWnvMo1dJiCoCUnHnKcmuTtjrNguK288ssULLZeJ9Rkdq8sLk6kENie4oShciRj45aK8AJZD"
analyze_transaction(tx_signature)
