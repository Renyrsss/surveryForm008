import { observer } from "mobx-react-lite";
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
import dataStore from "../../stores/dataStore";

const FullQuestionChart = observer(() => {
    const averages = dataStore.averages;

    const chartData = Object.entries(averages).map(([name, value]) => ({
        name: name.length > 40 ? name.slice(0, 40) + "..." : name,
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
        <div style={{ height: Math.max(400, chartData.length * 40) }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
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
                        width={250}
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
                        formatter={(value: number) => [value.toFixed(2), "Средний балл"]}
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
});

export default FullQuestionChart;
