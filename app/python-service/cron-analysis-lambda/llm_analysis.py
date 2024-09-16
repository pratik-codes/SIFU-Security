import json
import random
import google.generativeai as genai 
from config import LLM_API_KEY, LLM_MODEL_NAME,TRANSACTION_ANALYSIS_PROMPT


class LLMAnalysis:
	def __init__(self, api_key: str = LLM_API_KEY):
		# Configure Google Gen AI with the provided API key
		genai.configure(api_key=random.choice(api_key))
		self.model_name = LLM_MODEL_NAME

	# Send transactions in batch to LLM for analysis
	def batch_analyze_with_llm(self, transactions):
		# Format transactions for the LLM prompt
		
		formatted_transactions = [
			{
				"contract": tx['contract_address'],
				"signature": tx['transaction']['signatures'][0],
				"transaction_data": tx
			} for tx in transactions
		]
		
		print(formatted_transactions)
		chat_session = genai.GenerativeModel(
				self.model_name,
				generation_config={
					"temperature": 1,
					"top_p": 0.95,
					"top_k": 64,
					"max_output_tokens": 8192,
					"response_mime_type": "application/json",
				},
				system_instruction=TRANSACTION_ANALYSIS_PROMPT,
			)

		input_data = f"""
				Transactions: {formatted_transactions}
		"""


		# Send the combined input to the LLM for analysis
		response = chat_session.start_chat(
			history=[
				{
					"role": "user",
					"parts": [input_data]
				}
			]
		)

		
		# Ensure the LLM response is a valid JSON string
		try:
			analysis = json.loads(response.send_message("Analyze the above transactions").text)
		except Exception as e:
			analysis = [{"alert_status": "safe", "analysis_statement": "No issues detected"} for _ in transactions]
		
		print(json.dumps(analysis))
		return analysis
