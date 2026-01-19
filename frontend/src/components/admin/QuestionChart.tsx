import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts";

type Props = {
    data: Record<string, number>;
};

export default function QuestionChart({ data }: Props) {
    const chartData = Object.entries(data)
        .slice(0, 10)
        .map(([name, value]) => ({
            name: name.length > 25 ? name.slice(0, 25) + "..." : name,
            fullName: name,
            value,
        }));

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400">
                Нет данных для отображения
            </div>
        );
    }

    const getColor = (value: number) => {
        if (value >= 8) return "#22c55e";
        if (value >= 6) return "#f59e0b";
        return "#ef4444";
    };

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis
                        type="number"
                        domain={[0, 10]}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={150}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value: number) => [value.toFixed(1), "Средний балл"]}
                        labelFormatter={(_, payload) => payload[0]?.payload?.fullName || ""}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={index} fill={getColor(entry.value)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
