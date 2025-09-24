export const nivoDarkTheme = {
  textColor: "#e5e7eb",
  grid: { line: { stroke: "#262626" } },
  axis: {
    domain: { line: { stroke: "#404040" } },
    ticks: { line: { stroke: "#404040" }, text: { fill: "#a3a3a3" } },
    legend: { text: { fill: "#d4d4d4" } },
  },
  legends: { text: { fill: "#a3a3a3" } },
  tooltip: {
    container: {
      background: "#0a0a0a",
      color: "#e5e7eb",
      borderRadius: 6,
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      border: "1px solid #262626",
    },
  },
} as const;
