import { useState } from "react";

import getData from "../service/service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
registerLocale("ru", ru);

function MonthBtn() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleFilter = () => {
        const url = `http://192.168.101.25:1339/api/data-quests?filters[$and][0][createdAt][$gt]=${decodeURIComponent(
            startDate
        )}&filters[$and][1][createdAt][$lte]=${encodeURIComponent(endDate)}`;
        console.log(encodeURIComponent(endDate));
        getData(url);
        // здесь можешь отправить запрос или отфильтровать данные по датам
    };

    const handleStartChange = (date: Date | null) => {
        if (date) {
            const iso = date.toISOString();
            setStartDate(iso);

            if (endDate && new Date(endDate) < date) {
                setEndDate(""); // сбросить, если конечная раньше начальной
            }
        } else {
            setStartDate("");
        }
    };

    const handleEndChange = (date: Date | null) => {
        if (date) {
            const iso = date.toISOString();

            setEndDate(iso);
        } else {
            setEndDate("");
        }
    };

    return (
        <div className='flex gap-[20px] text-[18px] flex-wrap'>
            <div className='flex items-center gap-4'>
                <div className='flex items-center gap-[10px]'>
                    <label className='mb-1'>С:</label>

                    <DatePicker
                        className='bg-white p-[10px] rounded-[10px]'
                        selected={startDate ? new Date(startDate) : null}
                        onChange={handleStartChange}
                        locale='ru'
                        dateFormat='dd.MM.yyyy'
                        maxDate={endDate ? new Date(endDate) : undefined}
                        placeholderText='Начальная дата'
                    />
                </div>

                <div className='flex items-center gap-[10px]'>
                    <label className='mb-1'>По:</label>
                    <DatePicker
                        className='bg-white p-[10px] rounded-[10px]'
                        selected={endDate ? new Date(endDate) : null}
                        onChange={handleEndChange}
                        locale='ru'
                        dateFormat='dd.MM.yyyy'
                        minDate={startDate ? new Date(startDate) : undefined}
                        placeholderText='Конечная дата'
                    />
                </div>
                <button
                    onClick={handleFilter}
                    className='bg-blue-600 text-white py-[5px] px-[15px] rounded-[10px] cursor-pointer '>
                    Поиск
                </button>
            </div>
        </div>
    );
}

export default MonthBtn;
