import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { calculateAverageFromRawData } from "../service/service";
import { toJS } from "mobx";
import DataStore from "../store/DataStore";

function OverViewCharts() {
    const averages = calculateAverageFromRawData(toJS(DataStore.dataJsons));
    const chartData = Object.entries(averages).map(([question, avg]) => ({
        name: question,
        avg,
    }));
    console.log(chartData);

    return (
        <div className='w-full h-[1700px]'>
            <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                    <CartesianGrid strokeDasharray='2 2' />
                    <XAxis type='number' domain={[0, 10]} />
                    <YAxis type='category' dataKey='name' width={500} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='avg' fill='#82ca9d' name='Средний балл' />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default OverViewCharts;
