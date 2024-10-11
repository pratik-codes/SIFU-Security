import requests
import json
from base64 import b64encode

class SolanaProgramSimulator:
    def __init__(self, rpc_url):
        self.rpc_url = rpc_url

    def simulate(self, processed_transaction):
        # Prepare the transaction for simulation
        sim_transaction = {
            "feePayer": processed_transaction['feePayer'],
            "recentBlockhash": processed_transaction['recentBlockhash'],
            "instructions": processed_transaction['instructions']
        }

        # Encode the transaction
        encoded_transaction = b64encode(json.dumps(sim_transaction).encode()).decode()

        # Prepare the RPC request
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "simulateTransaction",
            "params": [
                encoded_transaction,
                {
                    "encoding": "base64",
                    "commitment": "confirmed"
                }
            ]
        }

        # Send the RPC request
        response = requests.post(self.rpc_url, json=payload)
        simulation_result = response.json()

        # Process the simulation result
        if 'result' in simulation_result:
            return simulation_result['result']
        else:
            raise Exception(f"Simulation failed: {simulation_result.get('error', 'Unknown error')}")
