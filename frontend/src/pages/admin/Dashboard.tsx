import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { Users, TrendingUp, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import dataStore from "../../stores/dataStore";
import { fetchSurveyResponses } from "../../api/surveys";
import StatsCard from "../../components/admin/StatsCard";
import QuestionChart from "../../components/admin/QuestionChart";
import TrendChart from "../../components/admin/TrendChart";
import FilterBar from "../../components/admin/FilterBar";

const Dashboard = observer(() => {
    useEffect(() => {
        fetchSurveyResponses();
    }, []);

    const { totalCount, yesNoStats, averages, trendsByDate } = dataStore;

    const avgScore =
        Object.values(averages).length > 0
            ? (Object.values(averages).reduce((a, b) => a + b, 0) / Object.values(averages).length).toFixed(1)
            : "—";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
                    <p className="text-slate-500">Обзор результатов опросов</p>
                </div>
                <button
                    onClick={() => fetchSurveyResponses()}
                    disabled={dataStore.isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${dataStore.isLoading ? "animate-spin" : ""}`} />
                    Обновить
                </button>
            </div>

            {/* Filters */}
            <FilterBar />

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <StatsCard
                    title="Всего ответов"
                    value={totalCount}
                    icon={Users}
                    color="sky"
                />
                <StatsCard
                    title="Средний балл"
                    value={avgScore}
                    icon={TrendingUp}
                    color="teal"
                    suffix="/ 10"
                />
                <StatsCard
                    title="Положительных"
                    value={yesNoStats.totalYes}
                    icon={CheckCircle}
                    color="green"
                />
                <StatsCard
                    title="Отрицательных"
                    value={yesNoStats.totalNo}
                    icon={XCircle}
                    color="red"
                />
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Динамика заполнений
                    </h2>
                    <TrendChart data={trendsByDate} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Средние оценки
                    </h2>
                    <QuestionChart data={averages} />
                </motion.div>
            </div>
        </div>
    );
});

export default Dashboard;
