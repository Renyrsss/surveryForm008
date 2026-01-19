import { observer } from "mobx-react-lite";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import dataStore from "../../stores/dataStore";

const YesNoChart = observer(() => {
    const { stats } = dataStore.yesNoStats;

    const chartData = Object.entries(stats).map(([question, values]) => ({
        question: question.length > 30 ? question.slice(0, 30) + "..." : question,
        fullQuestion: question,
        Да: values.yes,
        Нет: values.no,
    }));

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400">
                Нет данных для отображения
            </div>
        );
    }

    return (
        <div style={{ height: Math.max(300, chartData.length * 60) }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                        type="category"
                        dataKey="question"
                        width={200}
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
                        labelFormatter={(_, payload) => payload[0]?.payload?.fullQuestion || ""}
                    />
                    <Legend />
                    <Bar dataKey="Да" fill="#22c55e" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Нет" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
});

export default YesNoChart;
