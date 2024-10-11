import base58
from solders.keypair import Keypair
from solders.pubkey import Pubkey
import hashlib

def main():
    # Create a new keypair for the verifier (this simulates the off-chain signer)
    verifier_keypair = Keypair()
    verifier_private_key = verifier_keypair.secret()
    verifier_public_key = verifier_keypair.pubkey()

    print("Verifier Keypair Information:")
    print(f"Public Key (base58): {verifier_public_key}")
    print(f"Public Key (bytes): {bytes(verifier_public_key).hex()}")
    print(f"Public Key (array format for Solana Playground): {list(bytes(verifier_public_key))}")
    print(f"Private Key (base58): {base58.b58encode(bytes(verifier_private_key)).decode()}")

    print("\nInstructions for initializing the verifier contract:")
    print(f"1. Use this public key when initializing the verifier contract: {bytes(verifier_public_key).hex()}")
    print("2. The verifier state account is a PDA and will be automatically derived in the contract.")

    # Simulate a withdrawal transaction
    pool_address = Pubkey.from_string("DE8mBCGgZi8aFHfXvdsjWUFWb8MJnZv8SFxvA8xzUVpt")  # Replace with actual pool address
    user_address = Pubkey.from_string("BYq5RpPNPa4WEHJgNtapdP2Re5wtyzNSTLbcNwtdguM8")  # Replace with an actual user public key
    amount = 1000000  # 1 SOL in lamports

    # Create the message to sign (same as in the Rust contract)
    message = hashlib.sha256()
    message.update(bytes(pool_address))
    message.update(bytes(user_address))
    message.update(amount.to_bytes(8, 'little'))  # Amount serialized as little-endian 8-byte integer
    message_bytes = message.digest()

    # Sign the message
    signature = verifier_keypair.sign_message(message_bytes)

    # Convert message and signature to list of integers (byte array format)
    message_byte_array = list(message_bytes)  # Message as a byte array
    signature_byte_array = list(bytes(signature))  # Signature converted to bytes, then to array of integers

    print("\nWithdrawal Transaction Information:")
    print(f"Pool Address: {pool_address}")
    print(f"User Address: {user_address}")
    print(f"Amount: {amount} lamports")
    print(f"Message (byte array): {message_byte_array}")
    print(f"Signature (byte array): {signature_byte_array}")

    print("\nTo test the verifier contract:")
    print("1. Ensure the verifier contract is initialized with the public key provided above.")
    print("2. Use the following information when calling the verify_signature function:")
    print(f"   - Signature (as byte array): {signature_byte_array}")
    print(f"   - Message (byte array to verify): {message_byte_array}")
    print(f"   - Pool Address: {list(bytes(pool_address))}")
    print(f"   - User Address: {list(bytes(user_address))}")
    print(f"   - Amount (lamports): {amount}")

if __name__ == "__main__":
    main()


