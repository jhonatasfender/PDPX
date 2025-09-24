"use client";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { nivoDarkTheme } from "./charts-theme";

export function SalesLineChart() {
  const data = [
    {
      id: "Vendas",
      color: "hsl(210, 70%, 50%)",
      data: [
        { x: "Jan", y: 120 },
        { x: "Fev", y: 90 },
        { x: "Mar", y: 160 },
        { x: "Abr", y: 140 },
        { x: "Mai", y: 200 },
        { x: "Jun", y: 180 },
      ],
    },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveLine
        data={data}
        margin={{ top: 16, right: 24, bottom: 36, left: 40 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        enableGridX={false}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{ tickSize: 0, tickPadding: 8 }}
        colors={{ scheme: "category10" }}
        pointSize={8}
        useMesh
        theme={nivoDarkTheme}
      />
    </div>
  );
}

export function CategoryBarChart() {
  const data = [
    { categoria: "Sofás", vendas: 120 },
    { categoria: "Mesas", vendas: 80 },
    { categoria: "Cadeiras", vendas: 95 },
    { categoria: "Armários", vendas: 60 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveBar
        data={data}
        keys={["vendas"]}
        indexBy="categoria"
        margin={{ top: 16, right: 24, bottom: 36, left: 40 }}
        padding={0.3}
        colors={{ scheme: "category10" }}
        axisBottom={{ tickSize: 0, tickPadding: 8 }}
        axisLeft={{ tickSize: 0, tickPadding: 8 }}
        theme={nivoDarkTheme}
      />
    </div>
  );
}

export function ChannelPieChart() {
  const data = [
    { id: "Orgânico", value: 45 },
    { id: "Anúncios", value: 30 },
    { id: "Social", value: 15 },
    { id: "Referral", value: 10 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsivePie
        data={data}
        margin={{ top: 16, right: 24, bottom: 36, left: 24 }}
        innerRadius={0.5}
        padAngle={1}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "category10" }}
        enableArcLinkLabels={false}
        theme={nivoDarkTheme}
      />
    </div>
  );
}
