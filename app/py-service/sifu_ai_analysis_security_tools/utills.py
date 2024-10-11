from solders.pubkey import Pubkey
from solana.rpc.api import Client
import base58

def is_valid_contract_address(address):
    try:
        public_key = Pubkey.from_string(address)
        return True
    except ValueError:
        return False

def is_valid_signature(signature):
    try:
        decoded = base58.b58decode(signature)
        return len(decoded) == 64
    except ValueError:
        return False