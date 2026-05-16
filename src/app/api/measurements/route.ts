import { NextResponse } from "next/server";
import { getDeviceStatus } from "@/lib/tuya";
import { BodyMeasurement, TuyaDeviceStatus } from "@/types";

function mapStatusToMeasurement(statuses: TuyaDeviceStatus[]): Partial<BodyMeasurement> {
  const map: Record<string, number> = {};
  for (const s of statuses) {
    map[s.code] = Number(s.value);
  }
  return {
    timestamp: Date.now(),
    weight: (map["weight"] ?? 0) / 100,
    bmi: (map["bmi"] ?? 0) / 10,
    bodyFat: (map["body_fat"] ?? 0) / 10,
    muscleMass: (map["muscle_mass"] ?? 0) / 100,
    boneMass: (map["bone_mass"] ?? 0) / 100,
    waterContent: (map["water_content"] ?? 0) / 10,
    visceralFat: map["visceral_fat"] ?? 0,
    basalMetabolism: map["basal_metabolism"] ?? 0,
  };
}

export async function GET() {
  const deviceId = process.env.TUYA_DEVICE_ID;
  if (!deviceId) {
    return NextResponse.json({ error: "TUYA_DEVICE_ID not configured" }, { status: 500 });
  }

  try {
    const statuses = await getDeviceStatus(deviceId);
    const measurement = mapStatusToMeasurement(statuses);
    return NextResponse.json(measurement);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
