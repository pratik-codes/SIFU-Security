import base58
from solana.keypair import Keypair
from solana.transaction import Transaction

class SignatureGenerator:
    def __init__(self, private_key):
        self.keypair = Keypair.from_secret_key(base58.b58decode(private_key))
        self.public_key = self.keypair.public_key

    def generate_signature(self, transaction_data):
        # Deserialize the transaction
        transaction = Transaction.deserialize(base58.b58decode(transaction_data['data']))
        
        # Get the message of the transaction
        message = transaction.message()
        
        # Sign the message
        signature = self.keypair.sign(message)
        
        return base58.b58encode(signature)