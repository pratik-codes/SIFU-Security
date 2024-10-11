import os

class Config:
	LLM_API_KEY = "your-llm-api-key-here"
	LLM_MODEL_NAME = "custom-trained-sifu-checkpoint-v120"
	SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"
	CONTRACT_CODE = """
	// Your Solana program code here
	pub fn process_instruction(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
	    // ... (contract code)
	}
	"""
	TRANSACTION_ANALYSIS_PROMPT = """ """

    def __init__(self):
        if not all([self.SOLANA_RPC_URL, self.LLM_API_KEY, self.LLM_MODEL_NAME, self.PRIVATE_KEY]):
            raise ValueError("Missing required environment variables")