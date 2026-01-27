import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import dataStore from "../../stores/dataStore";
import { fetchSurveyResponses } from "../../api/surveys";
import FilterBar from "../../components/admin/FilterBar";
import YesNoChart from "../../components/admin/YesNoChart";
import FullQuestionChart from "../../components/admin/FullQuestionChart";

const Analytics = observer(() => {
    useEffect(() => {
        if (dataStore.responses.length === 0) {
            fetchSurveyResponses();
        }
    }, []);

    const exportToExcel = () => {
        const data = dataStore.responses.map((r) => ({
            Дата: new Date(r.createdAt).toLocaleDateString("ru-RU"),
            Отделение: r.type || "—",
            ...r.dataJson,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ответы");
        XLSX.writeFile(wb, `Опросы_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Аналитика</h1>
                    <p className="text-slate-500">Детальный анализ ответов</p>
                </div>
                <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Экспорт в Excel
                </button>
            </div>

            <FilterBar />

            {/* Yes/No Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-6"
            >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Ответы Да / Нет
                </h2>
                <YesNoChart />
            </motion.div>

            {/* Full Question Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 p-6"
            >
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Все оценки по вопросам
                </h2>
                <FullQuestionChart />
            </motion.div>
        </div>
    );
});

export default Analytics;
