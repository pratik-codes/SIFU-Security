import axios from "axios";

export const mockData = {
  "score": 20,
  "conclusion": "This contract is highly dangerous. It uses a seemingly innocent condition to execute a hidden function that transfers the entire pool balance to the admin account. This action is masked within a function that appears to be performing routine maintenance tasks.",
  "evaluation": "The code uses a subtle condition in the `perform_maintenance_tasks` function, which leverages the user and admin account public keys' bytes to trigger a silent transfer of the entire pool's SOL balance to the admin account. This behavior is cleverly disguised within the seeming normal function of routine maintenance.",
  "Issues": {
    "Hidden Fund Transfer": "The `perform_maintenance_tasks` function uses a hidden condition based on the first byte of the user and admin account public keys to trigger a silent transfer of the pool's SOL balance to the admin account. This transfer happens under the guise of \"maintenance tasks\", misleading users about the true nature of the operation.",
    "Lack of Transparency": "The contract lacks transparency about the hidden condition that triggers the fund transfer. This lack of transparency makes it difficult for users to understand the potential risks associated with interacting with the contract.",
    "Potential for Abuse": "The hidden transfer mechanism can be easily abused by the admin, allowing them to drain the entire pool of funds without the user's knowledge or consent.",
    "Misleading User Interface": "The contract uses seemingly normal function names and descriptions to conceal the malicious behavior. Users may be misled into believing that the contract is safe and legitimate."
  },
  "fixes": {
    "Transparent Condition": "The hidden condition should be removed or explicitly documented in the contract's documentation. This would allow users to understand the potential risks involved.",
    "Clear Function Names": "The function names should accurately reflect the intended functionality of the code. For example, the `perform_maintenance_tasks` function should be renamed to something more descriptive, such as `transferPoolFundsToAdmin`.",
    "Input Validation": "The contract should include input validation to prevent malicious actors from exploiting the hidden condition. For example, the contract could require a specific password or authorization token from the admin to trigger the fund transfer.",
    "Audit Trail": "The contract should implement an audit trail to track all transactions and actions, making it easier to identify any suspicious activity."
  }
}

const ApiUrl = "https://9lmsq1tb3g.execute-api.us-east-1.amazonaws.com/dev/detect";

const extraHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': process.env.AUTH_KEY,
}

export const ScanApiCall = async ({ body, headers, method }) => {
  try {
    const res = await axios({
      method: method,
      url: ApiUrl,
      data: body,
      headers: { ...headers, ...extraHeaders },
    });

    if (res.status === 200) {
      console.log("Success in ScanApiCall: ", res.data);
      return { ok: true, data: res.data };
    }

    return { ok: false, error: res };
  } catch (error) {
    console.log("ERROR in ScanApiCall: ", error);
    return { error: error, ok: false };
  }
};

