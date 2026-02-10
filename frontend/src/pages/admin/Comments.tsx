import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { Download, Search, MessageSquare, Building2, Calendar } from "lucide-react";
import * as XLSX from "xlsx";
import dataStore from "../../stores/dataStore";
import { fetchSurveyResponses } from "../../api/surveys";
import { DEPARTMENTS, normalizeDepartment } from "../../constants/departments";

const COMMENT_KEYS = [
    "Комментарий",
    "Ваши замечания, пожелания, предложения",
    "Сіздің ескертулеріңіз, тілектеріңіз, ұсыныстарыңыз",
    "Сіздің пікірлеріңіз",
];

const COMMENT_KEYWORDS = [
    "комментар",
    "замечан",
    "пожелан",
    "предложен",
    "ескерт",
    "тілек",
    "ұсыныс",
    "пікір",
];

function extractComment(dataJson: Record<string, unknown>): string {
    for (const key of COMMENT_KEYS) {
        const value = dataJson[key];
        if (typeof value === "string" && value.trim() !== "") return value;
    }

    for (const [key, value] of Object.entries(dataJson)) {
        if (
            typeof value === "string" &&
            value.trim() !== "" &&
            COMMENT_KEYWORDS.some((keyword) =>
                key.toLowerCase().includes(keyword)
            )
        ) {
            return value;
        }
    }

    return "";
}

const Comments = observer(() => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        if (dataStore.responses.length === 0) {
            fetchSurveyResponses();
        }
    }, []);

    const comments = useMemo(() => {
        return dataStore.responses
            .map((r) => ({
                createdAt: r.createdAt,
                date: new Date(r.createdAt).toLocaleDateString("ru-RU"),
                department: normalizeDepartment(r.type) || "—",
                text: extractComment(r.dataJson as Record<string, unknown>),
            }))
            .filter((c) => c.text.trim() !== "");
    }, [dataStore.responses]);

    const filteredComments = useMemo(() => {
        return comments
            .filter((c) => {
                if (department === "all") return true;
                return c.department === department;
            })
            .filter((c) => {
                if (!startDate && !endDate) return true;
                const date = new Date(c.createdAt);
                if (Number.isNaN(date.getTime())) return true;
                const day = date.toISOString().slice(0, 10);
                if (startDate && day < startDate) return false;
                if (endDate && day > endDate) return false;
                return true;
            })
            .filter(
                (c) =>
                    search === "" ||
                    c.text.toLowerCase().includes(search.toLowerCase()) ||
                    c.department.toLowerCase().includes(search.toLowerCase())
            );
    }, [comments, department, endDate, search, startDate]);

    useEffect(() => {
        setPage(1);
    }, [search, department, startDate, endDate, pageSize]);

    const totalPages = Math.max(1, Math.ceil(filteredComments.length / pageSize));
    const currentPage = Math.min(page, totalPages);

    const paginatedComments = useMemo(() => {
        const from = (currentPage - 1) * pageSize;
        return filteredComments.slice(from, from + pageSize);
    }, [currentPage, filteredComments, pageSize]);

    const visiblePages = useMemo(() => {
        const pages: number[] = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }, [currentPage, totalPages]);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredComments);
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
                        Отзывы и предложения пациентов ({filteredComments.length})
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

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <Building2 className="w-4 h-4" />
                            Отделение
                        </label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="all">Все отделения</option>
                            {DEPARTMENTS.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.ruLabel}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <Calendar className="w-4 h-4" />
                            Дата от
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <Calendar className="w-4 h-4" />
                            Дата до
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-500 mb-2">
                            На странице
                        </label>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {paginatedComments.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Комментариев пока нет</p>
                    </div>
                ) : (
                    paginatedComments.map((comment, index) => (
                        <motion.div
                            key={`${comment.createdAt}-${index}`}
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

            {/* Pagination */}
            {filteredComments.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-slate-500">
                        Показано {(currentPage - 1) * pageSize + 1}-
                        {Math.min(currentPage * pageSize, filteredComments.length)} из{" "}
                        {filteredComments.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 disabled:opacity-40"
                        >
                            Назад
                        </button>
                        {visiblePages.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-2 rounded-lg text-sm border ${
                                    p === currentPage
                                        ? "bg-sky-500 text-white border-sky-500"
                                        : "bg-white text-slate-700 border-slate-200"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 disabled:opacity-40"
                        >
                            Вперед
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Comments;
