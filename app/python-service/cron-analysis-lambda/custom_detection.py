from datetime import datetime

# Known malicious addresses (can be fetched from a dynamic list or API)
KNOWN_MALICIOUS_ADDRESSES = []

# Define thresholds for detection
LARGE_TRANSFER_THRESHOLD = 1_000_000  # Example threshold for large transfers
WALLET_AGE_THRESHOLD_DAYS = 30  # Consider a wallet new if it's less than 30 days old

def run_custom_detection(transaction):
    """
    Run custom detection logic based on transaction data. This includes:
    - Large token transfers
    - New wallet detection
    - Multiple SPL token transfers
    - Blacklisted/suspicious addresses
    - Repetitive function calls
    """
    analysis_statements = []

    # Get transaction details
    instructions = transaction['transaction']['message']['instructions']
    account_keys = transaction['transaction']['message']['accountKeys']

    # 1. Detect large token transfers
    if detect_large_transfers(instructions):
        analysis_statements.append("Large token transfer detected")

    # 2. Check for interactions with new wallets
    if detect_new_wallet(account_keys):
        analysis_statements.append("New wallet interaction detected")

    # 3. Detect multiple SPL token transfers
    if detect_multiple_spl_transfers(instructions):
        analysis_statements.append("Multiple SPL token transfers detected")

    # # 4. Check for interactions with known malicious addresses
    # if detect_known_suspicious_addresses(account_keys):
    #     analysis_statements.append("Interaction with known suspicious address")

    # 5. Detect repetitive function calls
    if detect_repetitive_function_calls(instructions):
        analysis_statements.append("Repetitive contract function calls detected")

    # If no issues detected, return 'safe'
    if not analysis_statements:
        return "safe"

    # Join analysis statements into a single string
    return " | ".join(analysis_statements)

def detect_large_transfers(instructions):
    """Detect large SOL or SPL token transfers"""
    for instruction in instructions:
        if 'parsed' in instruction and 'info' in instruction['parsed']:
            amount = int(instruction['parsed']['info'].get('amount', 0))
            if amount > LARGE_TRANSFER_THRESHOLD:
                return True
    return False

def detect_new_wallet(account_keys):
    """Detect if the transaction interacts with a new wallet (created less than 30 days ago)"""
    for account in account_keys:
        # In a real implementation, you would query the blockchain for the wallet's creation date
        wallet_creation_time = datetime(2024, 1, 1)  # Mock wallet creation time for now
        wallet_age_days = (datetime.utcnow() - wallet_creation_time).days
        if wallet_age_days < WALLET_AGE_THRESHOLD_DAYS:
            return True
    return False

def detect_multiple_spl_transfers(instructions):
    """Detect multiple SPL token transfers in a single transaction"""
    spl_transfer_count = sum(1 for instruction in instructions if instruction['programId'] == 'SPL Token Program')
    return spl_transfer_count > 1

def detect_known_suspicious_addresses(account_keys):
    """Check if any account in the transaction is a known malicious or suspicious address"""
    for account in account_keys:
        if account['pubkey'] in KNOWN_MALICIOUS_ADDRESSES:
            return True
    return False

def detect_repetitive_function_calls(instructions):
    """Detect repetitive contract function calls within a single transaction"""
    called_functions = [instr['parsed']['type'] for instr in instructions if 'parsed' in instr]
    return len(called_functions) > len(set(called_functions))  # Repeated calls detected if len(set) < len(list)
