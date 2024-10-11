import json
import ed25519
import base58
import hashlib

def generate_keypair():
    """Generate a new ed25519 keypair."""
    private_key, public_key = ed25519.create_keypair()
    return private_key, public_key

def sign_transaction(private_key, transaction):
    """Sign a transaction using the provided private key."""
    message = hashlib.sha256(json.dumps(transaction).encode()).digest()
    signature = private_key.sign(message)
    return signature, message

def verify_signature(public_key, signature, message):
    """Verify a signature using the provided public key."""
    try:
        public_key.verify(signature, message)
        return True
    except ed25519.BadSignatureError:
        return False

def main():
    # Generate a keypair
    private_key, public_key = generate_keypair()
    print(f"Public Key: {base58.b58encode(public_key.to_bytes()).decode()}")

    # Create a sample transaction
    transaction = {
        "feePayer": "6CEJaCUtFzVVt9xYk85EsQLm17wkKYRyBgBaxFp2Smw9",
        "recentBlockhash": "DgQaK7YTg41C5EpX9zM63q97xDaXzCih5RzcxQfaWStT",
        "instructions": [
            {
                "programId": "24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk",
                "keys": [
                    {
                        "pubkey": "84jajXHvShtz1yuQwyJryW1nZJ2RSVzncFPP8xcsYQwX",
                        "isSigner": False,
                        "isWritable": True
                    },
                    {
                        "pubkey": "6CEJaCUtFzVVt9xYk85EsQLm17wkKYRyBgBaxFp2Smw9",
                        "isSigner": True,
                        "isWritable": True
                    },
                    {
                        "pubkey": "11111111111111111111111111111111",
                        "isSigner": False,
                        "isWritable": False
                    }
                ],
                "data": "b712469c946da12280841e0000000000"
            }
        ]
    }

    # Sign the transaction
    signature, message = sign_transaction(private_key, transaction)
    print(f"Signature: {base58.b58encode(signature).decode()}")
    print(f"Message: {base58.b58encode(message).decode()}")

    # Verify the signature
    is_valid = verify_signature(public_key, signature, message)
    print(f"Signature is valid: {is_valid}")

    # Simulate an invalid signature
    invalid_signature = b'x' * 64
    is_valid = verify_signature(public_key, invalid_signature, message)
    print(f"Invalid signature is valid: {is_valid}")

if __name__ == "__main__":
    main()
