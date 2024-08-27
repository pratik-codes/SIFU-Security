import { STATUS_CODES } from "http";
import { NextResponse } from "next/server";
import { z } from "zod"
import { mockData, ScanApiCall } from "../util";

const scanSchema = z.object({
  action: z.string(),
  contract_code: z.string().optional(),
  contract_address: z.string().optional(),
  tx_signature: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const headers = req.headers;
    const body = scanSchema.parse(json)
    const response: any = await ScanApiCall({ body: json, headers: headers, method: "POST" });
    console.log("API RESPONSE: ", { response });
    if (!response.ok) {
      return new Response("something went wrong, error: " + JSON.stringify(response.error), { status: 500 })
    }

    return NextResponse.json({ data: response.data, status: 200 });
  } catch (error) {
    console.log("ERROR WHILE SCAN API: ", { error });
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    // something went wrong
    return new Response(null, { status: 500 })
  }
}
