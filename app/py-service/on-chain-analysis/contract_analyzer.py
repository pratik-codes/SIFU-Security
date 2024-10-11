import json

class ContractAnalyzer:
    def __init__(self, idl_json, contract_code):
        self.idl = idl_json
        self.contract_code = contract_code

    def analyze(self, processed_transaction, simulation_result):
        # Extract the program ID from the transaction
        program_id = processed_transaction['instructions'][0]['programId']

        # Find the instruction in the IDL
        instruction_name = None
        for ix in self.idl['instructions']:
            if ix['programId'] == program_id:
                instruction_name = ix['name']
                break

        # Analyze the instruction data
        instruction_data = bytes.fromhex(processed_transaction['instructions'][0]['data'])
        data_analysis = self._analyze_instruction_data(instruction_data)

        # Analyze the simulation result
        sim_analysis = self._analyze_simulation_result(simulation_result)

        # Perform static analysis on the contract code
        static_analysis = self._static_analysis()

        return {
            'instruction_name': instruction_name,
            'data_analysis': data_analysis,
            'simulation_analysis': sim_analysis,
            'static_analysis': static_analysis
        }