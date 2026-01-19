import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { Download, Search, MessageSquare } from "lucide-react";
import * as XLSX from "xlsx";
import dataStore from "../../stores/dataStore";
import { fetchSurveyResponses } from "../../api/surveys";

const Comments = observer(() => {
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (dataStore.responses.length === 0) {
            fetchSurveyResponses();
        }
    }, []);

    const comments = useMemo(() => {
        return dataStore.responses
            .map((r) => ({
                date: new Date(r.createdAt).toLocaleDateString("ru-RU"),
                department: r.type || "—",
                text: String(r.dataJson["Комментарий"] || r.dataJson["Ваши замечания, пожелания, предложения"] || ""),
            }))
            .filter((c) => c.text.trim() !== "")
            .filter(
                (c) =>
                    search === "" ||
                    c.text.toLowerCase().includes(search.toLowerCase()) ||
                    c.department.toLowerCase().includes(search.toLowerCase())
            );
    }, [dataStore.responses, search]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(comments);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Комментарии");
        XLSX.writeFile(wb, `Комментарии_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Комментарии</h1>
                    <p className="text-slate-500">
                        Отзывы и предложения пациентов ({comments.length})
                    </p>
                </div>
                <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Экспорт
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по комментариям..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Комментариев пока нет</p>
                    </div>
                ) : (
                    comments.map((comment, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <span className="px-3 py-1 bg-sky-50 text-sky-700 text-sm font-medium rounded-lg">
                                    {comment.department}
                                </span>
                                <span className="text-sm text-slate-400">
                                    {comment.date}
                                </span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                {comment.text}
                            </p>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
});

export default Comments;
