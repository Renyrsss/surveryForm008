import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import getData from "../service/service";
import DataStore from "../store/DataStore";

interface CommentEntry {
    department: string;
    comment: string;
    date?: string;
}

function Comments() {
    const [comments, setComments] = useState<CommentEntry[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchData = async () => {
        // сохраняем даты в MobX store (если используешь buildUrl)
        DataStore.startDate = startDate || "";
        DataStore.endDate = endDate || "";

        await getData();

        const extracted = DataStore.dataJsons
            .map((item: any) => {
                const data = item.dataJson || {};
                return {
                    department: data["отдел"] || "—",
                    comment:
                        data["Ваши замечания, пожелания, предложения"] || "",
                    date: item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "",
                };
            })
            .filter((e: CommentEntry) => e.comment.trim() !== "");

        setComments(extracted);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(comments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Комментарии");
        XLSX.writeFile(workbook, "Комментарии.xlsx");
    };

    return (
        <div className='p-4'>
            <h1 className='text-xl font-semibold mb-4'>
                Комментарии пациентов
            </h1>

            {/* Фильтр по дате */}
            <div className='flex items-center gap-3 mb-4'>
                <div>
                    <label className='block text-sm text-gray-600 mb-1'>
                        Дата от:
                    </label>
                    <input
                        type='date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className='border px-2 py-1 rounded'
                    />
                </div>
                <div>
                    <label className='block text-sm text-gray-600 mb-1'>
                        Дата до:
                    </label>
                    <input
                        type='date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className='border px-2 py-1 rounded'
                    />
                </div>
                <button
                    onClick={fetchData}
                    className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'>
                    Применить
                </button>
            </div>

            <button
                onClick={exportToExcel}
                className='mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                💾 Выгрузить в Excel
            </button>

            <table className='min-w-full border border-gray-300'>
                <thead>
                    <tr className='bg-gray-100'>
                        <th className='border px-4 py-2 text-left'>Дата</th>
                        <th className='border px-4 py-2 text-left'>Отдел</th>
                        <th className='border px-4 py-2 text-left'>
                            Комментарий
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {comments.length === 0 ? (
                        <tr>
                            <td colSpan={3} className='text-center py-4'>
                                Нет комментариев
                            </td>
                        </tr>
                    ) : (
                        comments.map((c, i) => (
                            <tr key={i}>
                                <td className='border px-4 py-2'>{c.date}</td>
                                <td className='border px-4 py-2'>
                                    {c.department}
                                </td>
                                <td className='border px-4 py-2'>
                                    {c.comment}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Comments;
