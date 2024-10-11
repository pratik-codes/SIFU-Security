import base64
import requests
import subprocess
import shutil 
import os
from capstone import Cs, CS_ARCH_BPF, CS_MODE_LITTLE_ENDIAN
from config import SOLANA_RPC_ENDPOINT

import r2pipe


# Constants
SOLANA_RPC_URL =  SOLANA_RPC_ENDPOINT # Replace with your RPC URL
PROGRAM_ACCOUNT_ADDRESS = "opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb"  # Replace with the actual program account address
OUTPUT_BINARY_FILE = "program_bytecode.bin"
DISASSEMBLED_OUTPUT_FILE = "disassembled_bytecode.txt"
RADARE2_ANALYSIS_FILE = "radare2_analysis.txt"
ANALYSIS_DUMP_FILE = "analysis_dump.txt"

HEX_DUMP_FILE = "hex_dump.txt"

def get_program_bytecode():
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getAccountInfo",
        "params": [
            PROGRAM_ACCOUNT_ADDRESS,
            {
                "encoding": "base64"
            }
        ]
    }
    
    response = requests.post(SOLANA_RPC_URL, json=payload)
    
    if response.status_code == 200:
        result = response.json().get('result')
        if result and result['value']:
            encoded_data = result['value']['data'][0]
            return base64.b64decode(encoded_data)
        else:
            raise ValueError("Account data is empty or program account not found.")
    else:
        raise Exception(f"Failed to fetch data: {response.status_code} - {response.text}")

def save_bytecode_to_file(bytecode):
    with open(OUTPUT_BINARY_FILE, 'wb') as f:
        f.write(bytecode)
    print(f"Bytecode saved to {OUTPUT_BINARY_FILE}")

def analyze_with_radare2():
    # Open the binary file with Radare2
    r2 = r2pipe.open(OUTPUT_BINARY_FILE)
    
    # Set the architecture to BPF
    r2.cmd('e asm.arch=bpf')
    
    # Perform a full analysis
    r2.cmd('aaa')
    
    # Dump the full analysis, including function listings and disassembly
    functions = r2.cmd('afl')
    disassembly = r2.cmd('pdi 1000')
    
    # Write the analysis results to a file
    with open(ANALYSIS_DUMP_FILE, 'w') as f:
        f.write("Functions found:\n" + functions)
        f.write("\nDisassembly (first 1000 instructions):\n" + disassembly)
    
    print(f"Radare2 analysis saved to {ANALYSIS_DUMP_FILE}")
    
    # Close Radare2
    r2.quit()

def main():
    try:
        # Step 1: Fetch the bytecode
        bytecode = get_program_bytecode()
        
        # Step 2: Save the bytecode to a binary file
        save_bytecode_to_file(bytecode)
        
        # Step 3: Analyze the bytecode with Radare2 and dump the results
        analyze_with_radare2()
        
        print("Radare2 analysis completed successfully.")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
