import json
import google.generativeai as genai
from config import LLM_MODEL_NAME, TRANSACTION_ANALYSIS_PROMPT

class LLMAnalysis:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model_name = LLM_MODEL_NAME

    def analyze(self, processed_transaction, simulation_result, contract_analysis):
        formatted_input = {
            "transaction": processed_transaction,
            "simulation_result": simulation_result,
            "contract_analysis": contract_analysis
        }

        chat_session = genai.GenerativeModel(
            self.model_name,
            generation_config={
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
            },
        )

        input_data = f"""
        {TRANSACTION_ANALYSIS_PROMPT}
        
        Transaction Data: {json.dumps(formatted_input, indent=2)}
        """

        response = chat_session.generate_content(input_data)

        try:
            analysis = json.loads(response.text)
        except json.JSONDecodeError:
            analysis = {
                "alert_status": "error",
                "analysis_statement": "Error: LLM response was not valid JSON. Raw response: " + response.text
            }

        return analysis