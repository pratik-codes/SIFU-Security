# solana_processor.py

import base58
from solana.rpc.async_api import AsyncClient
from solana.transaction import Transaction

class SolanaProcessor:
    def __init__(self, rpc_url):
        self.client = AsyncClient(rpc_url)

    def process_transaction(self, transaction_data):
        # Deserialize and process the transaction
        transaction = Transaction.deserialize(base58.b58decode(transaction_data['data']))
        # Add any additional processing logic here
        return {
            'message': str(transaction.message),
            'signatures': [str(sig) for sig in transaction.signatures],
            # Add more transaction details as needed
        }

    async def simulate_transaction(self, processed_transaction):
        # Simulate the transaction
        sim_response = await self.client.simulate_transaction(processed_transaction['message'])
        return sim_response.value

    async def fetch_account_data(self, processed_transaction):
        # Extract account keys from the transaction
        account_keys = processed_transaction['message'].account_keys
        
        account_data = {}
        for pubkey in account_keys:
            account_info = await self.client.get_account_info(pubkey)
            if account_info.value:
                account_data[str(pubkey)] = {
                    'lamports': account_info.value.lamports,
                    'owner': str(account_info.value.owner),
                    'data': base58.b58encode(account_info.value.data).decode(),
                    # Add more account info as needed
                }
        
        return account_data