import { observer } from "mobx-react-lite";
import DataStore from "../store/DataStore";
import getData, {
    buildUrl,
    calculateAverageFromRawData,
} from "../service/service";
import { toJS } from "mobx";
import { useEffect, useState } from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const MyChartComponent = observer(() => {
    const [side, setSide] = useState("Все");

    const averages = calculateAverageFromRawData(toJS(DataStore.dataJsons));

    const choices: string[] = [
        "КХО",
        "ИК-1",
        "ИК-2",
        "Гинекология",
        "Аритмология",
        "Терапия 2 ",
        "ОХ и ТХ",
        "НХО",
        "Урология",
        "ДКХО",
    ];

    const handleSideChange = (newSide: string) => {
        setSide(newSide);
        DataStore.setSide(newSide);
        const url = buildUrl();
        DataStore.setUrl(url);
        getData();
    };

    useEffect(() => {
        getData(); // первоначальная загрузка
    }, []);
    console.log(toJS(DataStore.dataJsons));

    return (
        <div className='space-y-8'>
            <div>
                <div className='flex gap-10 text-[20px] mb-[25px]'>
                    <p>Выберите отдел</p>
                    <select
                        value={side}
                        onChange={(e) => handleSideChange(e.target.value)}>
                        <option value='Все'>Все</option>
                        {choices.map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='text-[20px]'>
                    Количество заполненных отзывов: {DataStore.surveryCount}
                </div>
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
