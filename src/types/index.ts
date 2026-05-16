export interface BodyMeasurement {
  timestamp: number;
  weight: number;        // kg
  bmi: number;
  bodyFat: number;       // %
  muscleMass: number;    // kg
  boneMass: number;      // kg
  waterContent: number;  // %
  visceralFat: number;
  basalMetabolism: number; // kcal
}

export interface TuyaDeviceStatus {
  code: string;
  value: number | string | boolean;
}

export interface TuyaApiResponse<T> {
  success: boolean;
  result: T;
  t: number;
  tid: string;
}
