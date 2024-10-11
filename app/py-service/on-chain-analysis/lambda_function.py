import json
import asyncio
from solana_processor import SolanaProcessor
from transaction_analyzer import TransactionAnalyzer
from signature_generator import SignatureGenerator
from config import Config

async def lambda_handler(event, context):
    try:
        # Parse the input data
        body = json.loads(event['body'])
        transaction_data = body.get('transaction_data')

        if not transaction_data:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing transaction data'})
            }

        # Initialize components
        config = Config()
        solana_processor = SolanaProcessor(config.SOLANA_RPC_URL)
        transaction_analyzer = TransactionAnalyzer(config.LLM_API_KEY, config.LLM_MODEL_NAME)
        signature_generator = SignatureGenerator(config.PRIVATE_KEY)

        # Process the Solana transaction
        processed_transaction = solana_processor.process_transaction(transaction_data)

        # Simulate the transaction
        simulation_result = await solana_processor.simulate_transaction(processed_transaction)

        # Fetch contract account data
        contract_account_data = await solana_processor.fetch_account_data(processed_transaction)

        # Analyze the transaction
        analysis_result = await transaction_analyzer.analyze(
            processed_transaction, 
            simulation_result, 
            contract_account_data
        )

        # Determine if the transaction is safe based on LLM analysis
        is_safe = analysis_result.get('classification') == 'safe'

        # Generate signature if the transaction is deemed safe
        signature = None
        if is_safe:
            signature = signature_generator.generate_signature(transaction_data)

        # Prepare the response
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'transaction': processed_transaction,
                'simulation': simulation_result,
                'contract_account_data': contract_account_data,
                'analysis': analysis_result,
                'is_safe': is_safe,
                'signature': signature.decode() if signature else None,
                'public_key': str(signature_generator.public_key)
            })
        }
    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

    return response

def lambda_wrapper(event, context):
    return asyncio.get_event_loop().run_until_complete(lambda_handler(event, context))

# Set the entry point to the wrapper function
lambda_function = lambda_wrapper