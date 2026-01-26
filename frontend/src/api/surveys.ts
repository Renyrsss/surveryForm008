import api, { publicApi } from "./client";
import dataStore, { SurveyResponse } from "../stores/dataStore";

type StrapiResponse = {
    data: SurveyResponse[];
    meta: {
        pagination: {
            page: number;
            pageCount: number;
            total: number;
        };
    };
};

export async function fetchSurveyResponses() {
    dataStore.setLoading(true);
    dataStore.setError(null);

    try {
        const filters = dataStore.filters;
        const params = new URLSearchParams();

        let andIndex = 0;
        if (filters.startDate) {
            params.append(
                `filters[$and][${andIndex}][createdAt][$gt]`,
                filters.startDate
            );
            andIndex++;
        }
        if (filters.endDate) {
            params.append(
                `filters[$and][${andIndex}][createdAt][$lte]`,
                filters.endDate
            );
        }
        if (filters.department && filters.department !== "all") {
            params.append("filters[type][$eq]", filters.department);
        }

        let allData: SurveyResponse[] = [];
        let page = 1;
        let totalPages = 1;

        do {
            params.set("pagination[page]", String(page));
            params.set("pagination[pageSize]", "100");

            const res = await api.get<StrapiResponse>(`/data-quests?${params}`);
            allData = allData.concat(res.data.data);
            totalPages = res.data.meta.pagination.pageCount;
            page++;
        } while (page <= totalPages);

        dataStore.setResponses(allData);
    } catch (err) {
        dataStore.setError("Ошибка загрузки данных");
        console.error(err);
    } finally {
        dataStore.setLoading(false);
    }
}

export async function submitSurvey(payload: {
    dataJson: Record<string, unknown>;
    type: string;
}) {
    // Используем публичный API без токена
    const res = await publicApi.post("/data-quests", { data: payload });
    return res.data;
}

export async function verifyPinCode(code: string) {
    // Используем публичный API без токена
    const res = await publicApi.post<{ ok: boolean }>("/access-codes/verify", { code });
    return res.data;
}
