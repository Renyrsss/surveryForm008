import { observer } from "mobx-react-lite";
import DataStore from "../store/DataStore";
import { calculateAverageFromRawData } from "../service/service";
import { toJS } from "mobx";

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

const MyChartComponent = observer(() => {
    const averages = calculateAverageFromRawData(toJS(DataStore.dataJsons));

    return (
        <div className='space-y-8'>
            <div className=' text-[20px]'>
                Количество заполненных отзывов : {DataStore.surveryCount}
            </div>
            {Object.entries(averages).map(([question, avg]) => {
                const data = [{ name: question, avg }];

                return (
                    <div key={question} className='mb-4'>
                        <h3 className='text-lg font-semibold mb-1'>
                            {question}
                        </h3>
                        <p className='mb-2'>Средний балл: {avg}</p>
                        <ResponsiveContainer width='100%' height={80}>
                            <BarChart
                                data={data}
                                layout='vertical'
                                margin={{
                                    top: 0,
                                    right: 20,
                                    left: 20,
                                    bottom: 0,
                                }}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis type='number' domain={[0, 10]} />
                                <YAxis type='category' dataKey='name' hide />
                                <Tooltip />
                                <Bar dataKey='avg' fill='#82ca9d' />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );
            })}
        </div>
    );
});

export default MyChartComponent;
