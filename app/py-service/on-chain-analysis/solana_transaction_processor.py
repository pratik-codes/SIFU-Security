from solana.transaction import Transaction
from solana.system_program import SYS_PROGRAM_ID
from base58 import b58decode

class SolanaTransactionProcessor:
    def process(self, transaction_data):
        # Extract relevant information from the transaction data
        fee_payer = transaction_data['transaction']['feePayer']
        recent_blockhash = transaction_data['transaction']['recentBlockhash']
        instructions = transaction_data['transaction']['instructions']

        # Process instructions
        processed_instructions = []
        for instruction in instructions:
            processed_instruction = {
                'programId': instruction['programId'],
                'keys': instruction['keys'],
                'data': b58decode(instruction['data']).hex()
            }
            processed_instructions.append(processed_instruction)

        # Create a processed transaction object
        processed_transaction = {
            'feePayer': fee_payer,
            'recentBlockhash': recent_blockhash,
            'instructions': processed_instructions,
            'accounts': transaction_data['accounts']
        }

        return processed_transaction