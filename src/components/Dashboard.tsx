import { getDeviceStatus } from "@/lib/tuya";
import { BodyMeasurement, TuyaDeviceStatus } from "@/types";
import MetricCard from "./MetricCard";

function mapStatusToMeasurement(statuses: TuyaDeviceStatus[]): Partial<BodyMeasurement> {
  const map: Record<string, number> = {};
  for (const s of statuses) map[s.code] = Number(s.value);
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

async function fetchMeasurement(): Promise<Partial<BodyMeasurement> | null> {
  const deviceId = process.env.TUYA_DEVICE_ID;
  if (!deviceId || !process.env.TUYA_ACCESS_ID) return null;
  try {
    const statuses = await getDeviceStatus(deviceId);
    return mapStatusToMeasurement(statuses);
  } catch {
    return null;
  }
}

export default async function Dashboard() {
  const data = await fetchMeasurement();

  if (!data) {
    return (
      <div className="rounded-xl border border-yellow-700/40 bg-yellow-900/10 px-6 py-8 text-center">
        <p className="text-yellow-400 text-sm font-medium">
          Configure as variáveis de ambiente Tuya para visualizar os dados da balança.
        </p>
        <p className="mt-1 text-gray-500 text-xs">
          Preencha TUYA_ACCESS_ID, TUYA_CLIENT_SECRET e TUYA_DEVICE_ID no .env.local
        </p>
      </div>
    );
  }

  const metrics = [
    { label: "Peso", value: data.weight, unit: "kg", color: "blue" as const },
    { label: "IMC", value: data.bmi, unit: "", color: "purple" as const },
    { label: "Gordura Corporal", value: data.bodyFat, unit: "%", color: "red" as const },
    { label: "Massa Muscular", value: data.muscleMass, unit: "kg", color: "green" as const },
    { label: "Massa Óssea", value: data.boneMass, unit: "kg", color: "yellow" as const },
    { label: "Água Corporal", value: data.waterContent, unit: "%", color: "cyan" as const },
    { label: "Gordura Visceral", value: data.visceralFat, unit: "", color: "orange" as const },
    { label: "Metabolismo Basal", value: data.basalMetabolism, unit: "kcal", color: "pink" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <p className="text-right text-xs text-gray-600">
        Última leitura:{" "}
        {data.timestamp
          ? new Date(data.timestamp).toLocaleString("pt-BR")
          : "—"}
      </p>
    </div>
  );
}
