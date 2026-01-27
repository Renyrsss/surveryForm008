import { observer } from "mobx-react-lite";
import { Calendar, Building2, Search } from "lucide-react";
import dataStore from "../../stores/dataStore";
import { fetchSurveyResponses } from "../../api/surveys";

const departments = [
    { value: "all", label: "Все отделения" },
    { value: "КХО", label: "КХО" },
    { value: "ИК-1", label: "ИК-1" },
    { value: "ИК-2", label: "ИК-2" },
    { value: "Гинекология", label: "Гинекология" },
    { value: "Аритмология", label: "Аритмология" },
    { value: "Терапия 2", label: "Терапия 2" },
    { value: "ОХ и ТХ", label: "ОХ и ТХ" },
    { value: "НХО", label: "НХО" },
    { value: "Урология", label: "Урология" },
    { value: "ДКХО", label: "ДКХО" },
];

const FilterBar = observer(() => {
    const handleFilter = () => {
        fetchSurveyResponses();
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Department Filter */}
                <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Building2 className="w-4 h-4" />
                        Отделение
                    </label>
                    <select
                        value={dataStore.filters.department}
                        onChange={(e) => dataStore.setFilter("department", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                        {departments.map((d) => (
                            <option key={d.value} value={d.value}>
                                {d.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date From */}
                <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        Дата от
                    </label>
                    <input
                        type="date"
                        value={dataStore.filters.startDate}
                        onChange={(e) => dataStore.setFilter("startDate", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                </div>

                {/* Date To */}
                <div className="flex-1">
                    <label className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        Дата до
                    </label>
                    <input
                        type="date"
                        value={dataStore.filters.endDate}
                        onChange={(e) => dataStore.setFilter("endDate", e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleFilter}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-sky-200 transition-all"
                    >
                        <Search className="w-4 h-4" />
                        Найти
                    </button>
                </div>
            </div>
        </div>
    );
});

export default FilterBar;
