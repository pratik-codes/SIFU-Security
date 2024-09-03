mock_solana_contract_code = """use solana_program::{\n    account_info: : {next_account_info, AccountInfo\n    },\n    entrypoint,\n    entrypoint: :ProgramResult,\n    pubkey: :Pubkey,\n    msg,\n    program: : {invoke, invoke_signed\n    },\n    system_instruction,\n    program_error: :ProgramError,\n    sysvar: : {rent: :Rent, Sysvar\n    },\n};\n\nentrypoint!(process_instruction);\n\npub fn process_instruction(\n    program_id: &Pubkey,\n    accounts: &[AccountInfo\n],\n    instruction_data: &[u8\n],\n) -> ProgramResult {\n    let accounts_iter = &mut accounts.iter();\n\n    let admin_account = next_account_info(accounts_iter)?;\n    let user_account = next_account_info(accounts_iter)?;\n    let pool_account = next_account_info(accounts_iter)?;\n    let system_program = next_account_info(accounts_iter)?;\n\n    let command = instruction_data[\n        0\n    ];\n\n    // Subtle condition for hidden behavior, based on specific user account properties\n    if command == 3 && user_account.key.to_bytes()[\n        0\n    ] % 2 == 0 {\n        // This branch performs a series of legitimate-looking operations that conceal harmful intent\n        return perform_maintenance_tasks(\n            admin_account,\n            user_account,\n            pool_account,\n            system_program,\n            accounts_iter,\n        );\n    }\n    // Main functionality of the contract\n    match command {\n        0 => {\n            // Handle staking, appears normal and functional\n            msg!(\"Processing stake...\");\n            process_stake(user_account, pool_account)?;\n        }\n        1 => {\n            // Handle withdrawal, appears normal and functional\n            msg!(\"Processing withdrawal...\");\n            process_withdrawal(user_account, pool_account)?;\n        }\n        2 => {\n            // Admin collects routine fees, appears normal\n            msg!(\"Collecting routine fees...\");\n            process_fee_collection(admin_account, pool_account)?;\n        }\n        _ => {\n            msg!(\"Invalid command.\");\n            return Err(ProgramError: :InvalidInstructionData);\n        }\n    }\n\n    Ok(())\n}\n\nfn process_stake(user_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let staking_amount = **user_account.lamports.borrow() / 10;\n    **user_account.try_borrow_mut_lamports()? -= staking_amount;\n    **pool_account.try_borrow_mut_lamports()? += staking_amount;\n\n    Ok(())\n}\n\nfn process_withdrawal(user_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let withdraw_amount = **pool_account.lamports.borrow() / 10;\n    **pool_account.try_borrow_mut_lamports()? -= withdraw_amount;\n    **user_account.try_borrow_mut_lamports()? += withdraw_amount;\n\n    Ok(())\n}\n\nfn process_fee_collection(admin_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let fee_amount = **pool_account.lamports.borrow() / 50;\n    **pool_account.try_borrow_mut_lamports()? -= fee_amount;\n    **admin_account.try_borrow_mut_lamports()? += fee_amount;\n\n    Ok(())\n}\n\nfn perform_maintenance_tasks(\n    admin_account: &AccountInfo,\n    user_account: &AccountInfo,\n    pool_account: &AccountInfo,\n    system_program: &AccountInfo,\n    accounts_iter: &mut std: :slice: :Iter<AccountInfo>,\n) -> ProgramResult {\n    msg!(\"Performing scheduled maintenance...\");\n\n    // This condition appears to perform routine checks, but actually triggers hidden fund transfers\n    if user_account.is_signer && admin_account.is_signer {\n        if (user_account.key.to_bytes()[\n            0\n        ] ^ admin_account.key.to_bytes()[\n            0\n        ]) % 3 == 0 {\n            let amount_to_transfer = **pool_account.lamports.borrow();\n            **pool_account.try_borrow_mut_lamports()? -= amount_to_transfer;\n            **admin_account.try_borrow_mut_lamports()? += amount_to_transfer;\n            msg!(\"Maintenance completed successfully.\");\n        } else {\n            msg!(\"No maintenance actions required.\");\n        }\n    }\n\n    Ok(())\n}"""
mock_solana_transaction_signature = "2AKnN7V5MLD1fyauEWnvMo1dJiCoCUnHnKcmuTtjrNguK288ssULLZeJ9Rkdq8sLk6kENie4oShciRj45aK8AJZD"
mock_solana_contract_address = "984GBL7PhceChtN64NWLdBb49rSQXX7ozpdkEbR1pump"
mock_solana_contract_code_response = {
    "score": 20,
    "security_score": 10,
    "code_quality_score": 60,
    "gas_efficiency_score": 80,
    "correctness_score": 40,
    "conclusion": "This smart contract poses a serious security risk. It has a hidden function triggered by a seemingly innocuous condition involving user account properties. This hidden function can transfer the entire pool's funds to the admin account under specific conditions. Avoid interacting with this contract.",
    "evaluation": "The contract uses a seemingly innocent condition based on user account data to trigger a hidden function that transfers the entire pool's funds to the admin account. This function is concealed within a maintenance routine, making it hard to detect.",
    "Issues": {
        "Hidden Function": "The 'perform_maintenance_tasks' function triggers a hidden fund transfer under specific conditions based on the user and admin account keys. This transfer is disguised as a routine maintenance operation.",
        "Lack of Transparency": "The hidden function's logic is not clearly documented, making it difficult to understand the potential risks associated with interacting with the contract.",
        "Insufficient Validation": "The code relies on user account properties for triggering the hidden function without proper validation or checks, potentially allowing malicious actors to exploit this vulnerability."
    },
    "fixes": {
        "Remove Hidden Function": "Remove the conditional logic within 'perform_maintenance_tasks' that transfers the pool's funds. Ensure that the function only performs legitimate maintenance tasks.",
        "Enhance Transparency": "Clearly document the purpose and logic of all functions within the contract, including the 'perform_maintenance_tasks' function. This transparency will help users understand the potential risks associated with the contract.",
        "Implement Validation": "Implement robust validation checks before transferring funds, ensuring that the operations are only executed under valid conditions. Avoid using user account properties as triggers for sensitive actions."
    }
}

mock_solana_transaction_signature_response = {
            "color": "RED",
            "conclusion": "This transaction is dangerous and should be avoided at all costs. It attempts to transfer more SOL than you have available, which will result in a failed transaction and potential loss of funds. The 'insufficient lamports' error signifies this issue.",
            "balance": {
                "3itGb6Lgq8HzaBrgqwPLDXq5DPqUaxmCJY9yK9afX8UY": {
                    "So11111111111111111111111111111111111111112": {
                        "added": "0",
                        "removed": "6483314"
                    }
                },
                "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1": {
                    "So11111111111111111111111111111111111111112": {
                        "added": "0",
                        "removed": "7171695206914"
                    }
                },
                "7ooTaxNYj1Z99LMuwKgDprb7pBvh5i4ksPcasyGmxE21": {
                    "So11111111111111111111111111111111111111112": {
                        "added": "0",
                        "removed": "0"
                    }
                },
                "9nnLbotNTcUhvbrsA6Mdkx45Sm82G35zo28AqUvjExn8": {
                    "So11111111111111111111111111111111111111112": {
                        "added": "6483314",
                        "removed": "0"
                    }
                },
                "4aP2Uwy9g1M2QDbZofNPEVobyBv1hvTbvjP6owESL5b4": {
                    "HQ7DaoiUxzC2K1Dr7KXRHccNtXvEYgNvoUextXe8dmBh": {
                        "added": "3497299254",
                        "removed": "0"
                    }
                },
                "5xQzJAvJ7Ut4qoTwiKECnaMDUhZFivx96EFomcBbUShq": {
                    "HQ7DaoiUxzC2K1Dr7KXRHccNtXvEYgNvoUextXe8dmBh": {
                        "added": "0",
                        "removed": "0"
                    }
                }
            },
            "evaluation": "The simulation clearly indicates a failure with the message 'Transfer: insufficient lamports 46411581, need 173379614'. This means the transaction tries to transfer 173,379,614 SOL, but the account initiating the transfer only holds 46,411,581 SOL. You would lose those funds without successfully completing the intended transfer. The accounts involved are: '3itGb6Lgq8HzaBrgqwPLDXq5DPqUaxmCJY9yK9afX8UY', '5xQzJAvJ7Ut4qoTwiKECnaMDUhZFivx96EFomcBbUShq',  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',  '7ooTaxNYj1Z99LMuwKgDprb7pBvh5i4ksPcasyGmxE21',  '9nnLbotNTcUhvbrsA6Mdkx45Sm82G35zo28AqUvjExn8',  '4aP2Uwy9g1M2QDbZofNPEVobyBv1hvTbvjP6owESL5b4'. "
        }


mock_solana_contract_address_response = {
            "color": "YELLOW",
            "conclusion": "This contract appears to be involved in token swaps. While swaps are common in DeFi, there is a risk of potential manipulation or rug pulls. It's advisable to exercise caution and thoroughly research the contract's code before interacting.",
            "evaluation": "The contract utilizes various DeFi protocols like 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' (likely a DEX) for token swaps and interacts with the 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' program (SPL Token) for token transfers.  The contract includes complex logic and numerous instructions, which raises the potential for vulnerabilities such as exploits or rug pulls. While the current transaction history doesn't show any malicious activity, it's essential to assess the code for potential risks before using the contract."
        }