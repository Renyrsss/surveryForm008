import { LucideIcon } from "lucide-react";

type Props = {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color: "sky" | "teal" | "green" | "red" | "amber";
    suffix?: string;
};

const colorClasses = {
    sky: "from-sky-500 to-sky-600 shadow-sky-200",
    teal: "from-teal-500 to-teal-600 shadow-teal-200",
    green: "from-emerald-500 to-emerald-600 shadow-emerald-200",
    red: "from-rose-500 to-rose-600 shadow-rose-200",
    amber: "from-amber-500 to-amber-600 shadow-amber-200",
};

export default function StatsCard({ title, value, icon: Icon, color, suffix }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-900">
                        {value}
                        {suffix && <span className="text-lg font-normal text-slate-400 ml-1">{suffix}</span>}
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}
