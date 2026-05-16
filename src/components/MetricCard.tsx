type Color = "blue" | "purple" | "red" | "green" | "yellow" | "cyan" | "orange" | "pink";

const colorMap: Record<Color, string> = {
  blue: "text-blue-400 bg-blue-900/20 ring-blue-800/40",
  purple: "text-purple-400 bg-purple-900/20 ring-purple-800/40",
  red: "text-red-400 bg-red-900/20 ring-red-800/40",
  green: "text-emerald-400 bg-emerald-900/20 ring-emerald-800/40",
  yellow: "text-yellow-400 bg-yellow-900/20 ring-yellow-800/40",
  cyan: "text-cyan-400 bg-cyan-900/20 ring-cyan-800/40",
  orange: "text-orange-400 bg-orange-900/20 ring-orange-800/40",
  pink: "text-pink-400 bg-pink-900/20 ring-pink-800/40",
};

interface Props {
  label: string;
  value?: number;
  unit: string;
  color: Color;
}

export default function MetricCard({ label, value, unit, color }: Props) {
  const cls = colorMap[color];
  return (
    <div className={`rounded-xl p-4 ring-1 ${cls} flex flex-col gap-2`}>
      <span className="text-xs font-medium text-gray-400">{label}</span>
      <span className="text-2xl font-bold tabular-nums">
        {value !== undefined && value !== 0
          ? `${value.toFixed(1)}${unit ? " " + unit : ""}`
          : "—"}
      </span>
    </div>
  );
}
