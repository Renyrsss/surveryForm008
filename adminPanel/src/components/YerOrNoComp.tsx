import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { getYesNoStats } from "../service/service";
import { observer } from "mobx-react-lite";

import DataStore from "../store/DataStore";

import { toJS } from "mobx";

const YerOrNoComp = observer(() => {
    const yesNoStats = getYesNoStats(toJS(DataStore.dataJsons));
    // console.log(yesNoStats);

    return (
        <div className=''>
            <div className='text-[20px] font-bold mb-[20px]'>
                <hr />
                <p className='mt-[10px]'>
                    {" "}
                    Общее кол-во Да - {DataStore.yesNoTotal.Да}
                </p>
                <p> Общее кол-во Нет - {DataStore.yesNoTotal.Нет}</p>
            </div>
            {Object.entries(yesNoStats).map(([question, stats]) => {
                const data = [
                    { name: "Ответы", ДА: stats["Да"], НЕТ: stats["Нет"] },
                ];
                // console.log(data[0]["ДА"]);

                return (
                    <div key={question} className='mb-4'>
                        <h3 className='text-lg font-semibold mb-2'>
                            {question}
                        </h3>
                        <div className='mb-4'>
                            <p>Да - {data[0]["ДА"]}</p>
                            <p>Нет - {data[0]["НЕТ"]}</p>
                        </div>
                        <ResponsiveContainer width='100%' height={100}>
                            <BarChart
                                data={data}
                                layout='vertical'
                                margin={{
                                    top: 0,
                                    right: 30,
                                    left: 30,
                                    bottom: 0,
                                }}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis type='number' />
                                <YAxis type='category' dataKey='name' hide />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey='ДА' fill='#4ade80' />
                                <Bar dataKey='НЕТ' fill='#f87171' />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                );
            })}
        </div>
    );
});

export default YerOrNoComp;
