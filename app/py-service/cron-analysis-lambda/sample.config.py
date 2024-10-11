from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()



# Load environment variables
SOLANA_RPC_URL = os.getenv('SOLANA_RPC_URL', '')  # Solana RPC URL
DYNAMODB_TABLE = os.getenv('DYNAMODB_TABLE', 'SolanaTransactionAnalysis')  # DynamoDB Table Name
DYNAMODB_REGION="us-east-1"

CONTRACT_CONFIG_KEY = {
	"Jito":["Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"],
	"Jupiter":["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],
	"Pump.fun":["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
	"Drift":["dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH"],
	"Mariande Finance":["MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD"],
	"Meteora":["Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"]
}
REVERSE_CONTRACT_CONFIG = {item: key for key, value in CONTRACT_CONFIG_KEY.items() for item in value}

CONTRACT_ADDRESSES=",".join(address for key in CONTRACT_CONFIG_KEY for address in CONTRACT_CONFIG_KEY[key])

# CONTRACT_ADDRESSES = "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb,6iQKfEyhr3bZMotVkW6beNZz5CPAkiwvgV2CTje9pVSS,SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy,8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC,MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD"
TRANSACTION_ANALYSIS_PROMPT =os.getenv('TRANSACTION_ANALYSIS_PROMPT', '')
LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME")  
LLM_API_KEY = os.getenv("LLM_API_KEY").split(",")  # API key for  Gen AI

