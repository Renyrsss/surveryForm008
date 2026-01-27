import { makeAutoObservable } from "mobx";

export type SurveyResponse = {
    id: number;
    documentId?: string;
    dataJson: Record<string, string | number>;
    type?: string;
    createdAt: string;
};

class DataStore {
    responses: SurveyResponse[] = [];
    isLoading = false;
    error: string | null = null;

    filters = {
        department: "all",
        startDate: "",
        endDate: "",
    };

    constructor() {
        makeAutoObservable(this);
    }

    setResponses(data: SurveyResponse[]) {
        this.responses = data;
    }

    setLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    setFilter(key: keyof typeof this.filters, value: string) {
        this.filters[key] = value;
    }

    get totalCount() {
        return this.responses.length;
    }

    get yesNoStats() {
        const stats: Record<string, { yes: number; no: number }> = {};
        let totalYes = 0;
        let totalNo = 0;

        this.responses.forEach((r) => {
            Object.entries(r.dataJson).forEach(([q, a]) => {
                if (a === "Да" || a === "Нет" || a === "Иә" || a === "Жоқ") {
                    if (!stats[q]) stats[q] = { yes: 0, no: 0 };
                    const isYes = a === "Да" || a === "Иә";
                    if (isYes) {
                        stats[q].yes++;
                        totalYes++;
                    } else {
                        stats[q].no++;
                        totalNo++;
                    }
                }
            });
        });

        return { stats, totalYes, totalNo };
    }

    get averages() {
        const sums: Record<string, number> = {};
        const counts: Record<string, number> = {};

        this.responses.forEach((r) => {
            Object.entries(r.dataJson).forEach(([q, a]) => {
                if (typeof a === "number") {
                    sums[q] = (sums[q] || 0) + a;
                    counts[q] = (counts[q] || 0) + 1;
                }
            });
        });

        const result: Record<string, number> = {};
        Object.keys(sums).forEach((q) => {
            result[q] = Math.round((sums[q] / counts[q]) * 100) / 100;
        });
        return result;
    }

    get trendsByDate() {
        const counts: Record<string, number> = {};
        this.responses.forEach((r) => {
            const date = r.createdAt?.slice(0, 10);
            if (date) counts[date] = (counts[date] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, count }));
    }
}

export default new DataStore();
