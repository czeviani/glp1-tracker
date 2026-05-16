import crypto from "crypto";
import { TuyaApiResponse, TuyaDeviceStatus } from "@/types";

const BASE_URL = process.env.TUYA_BASE_URL!;
const ACCESS_ID = process.env.TUYA_ACCESS_ID!;
const CLIENT_SECRET = process.env.TUYA_CLIENT_SECRET!;

function sign(
  method: string,
  path: string,
  token: string,
  timestamp: string,
  body: string = ""
): string {
  const contentHash = crypto
    .createHash("sha256")
    .update(body)
    .digest("hex");
  const stringToSign = [method, contentHash, "", path].join("\n");
  const signStr = ACCESS_ID + token + timestamp + stringToSign;
  return crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(signStr)
    .digest("hex")
    .toUpperCase();
}

async function getToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const path = "/v1.0/token?grant_type=1";
  const signature = sign("GET", path, "", timestamp);

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      client_id: ACCESS_ID,
      sign: signature,
      t: timestamp,
      sign_method: "HMAC-SHA256",
    },
    next: { revalidate: 7000 }, // token expires in ~7200s
  });

  const data: TuyaApiResponse<{ access_token: string }> = await res.json();
  if (!data.success) throw new Error(`Tuya auth failed: ${JSON.stringify(data)}`);
  return data.result.access_token;
}

export async function getDeviceStatus(deviceId: string): Promise<TuyaDeviceStatus[]> {
  const token = await getToken();
  const timestamp = Date.now().toString();
  const path = `/v1.0/devices/${deviceId}/status`;
  const signature = sign("GET", path, token, timestamp);

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      client_id: ACCESS_ID,
      access_token: token,
      sign: signature,
      t: timestamp,
      sign_method: "HMAC-SHA256",
    },
    next: { revalidate: 60 },
  });

  const data: TuyaApiResponse<TuyaDeviceStatus[]> = await res.json();
  if (!data.success) throw new Error(`Device status failed: ${JSON.stringify(data)}`);
  return data.result;
}

export async function getDeviceLogs(
  deviceId: string,
  codes: string,
  startTime: number,
  endTime: number
): Promise<TuyaApiResponse<{ logs: { code: string; value: string; event_time: number }[] }>> {
  const token = await getToken();
  const timestamp = Date.now().toString();
  const path = `/v1.0/devices/${deviceId}/logs?codes=${codes}&start_row_key=&start_time=${startTime}&end_time=${endTime}&size=50`;
  const signature = sign("GET", path, token, timestamp);

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      client_id: ACCESS_ID,
      access_token: token,
      sign: signature,
      t: timestamp,
      sign_method: "HMAC-SHA256",
    },
  });

  return res.json();
}
