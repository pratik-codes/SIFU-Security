import axios from "axios";

const ScanApiUrl = "https://9lmsq1tb3g.execute-api.us-east-1.amazonaws.com/dev/detect";
const GetTransactionUrl = "https://ad6f4beav9.execute-api.us-east-1.amazonaws.com/default/dynamodb_lambda";

const ApiUrl = {
  "SCAN": ScanApiUrl,
  "GET_TRANSACTION": GetTransactionUrl
}

const transactionExtraHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': process.env.AUTH_KEY_TRANSACTION,
}

const scanExtraHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': process.env.AUTH_KEY,
}

export const ScanApiCall = async ({ body, headers, method }) => {
  try {
    const res = await axios({
      method: method,
      url: ScanApiUrl,
      data: body,
      headers: { ...headers, ...scanExtraHeaders }
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

export const GetScanResult = async (timeStamp: string) => {
  console.log({ timeStamp });

  // print the curl request
  console.log(`curl -X GET "${GetTransactionUrl}?timestamp=${timeStamp}" -H "x-api-key: ${process.env.AUTH_KEY_TRANSACTION}"`);

  try {
    const res = await axios({
      method: "GET",
      url: GetTransactionUrl + "?timestamp=" + timeStamp,
      headers: transactionExtraHeaders,
    });

    if (res.status === 200) {
      console.log("Success in GetTransactionCall: ", res.data);
      return { ok: true, data: res.data };
    }

    return { ok: false, error: res };
  } catch (error) {
    console.log("ERROR in GetTransactionCall: ", error);
    return { error: error, ok: false };
  }
}

