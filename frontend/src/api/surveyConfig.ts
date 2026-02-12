import api, { publicApi } from "./client";
import { normalizeDepartmentChoicesInSchema } from "../constants/departments";

export type SurveyConfigData = {
    id: number;
    documentId?: string;
    title: string;
    locale: string;
    schema: Record<string, unknown>;
    isActive: boolean;
    version?: string;
    notes?: string;
};

type StrapiSingleResponse = {
    data: SurveyConfigData;
};

type StrapiListResponse = {
    data: SurveyConfigData[];
    meta: {
        pagination: {
            page: number;
            pageCount: number;
            total: number;
        };
    };
};

const normalizeSurveyConfig = (item: unknown): SurveyConfigData | null => {
    if (!item || typeof item !== "object") return null;
    const record = item as SurveyConfigData & {
        attributes?: SurveyConfigData;
        documentId?: string;
    };

    if (record.attributes) {
        return {
            ...record.attributes,
            id: record.id,
            documentId: record.documentId ?? record.attributes.documentId,
        };
    }

    return record;
};

const normalizeSurveyConfigList = (data: unknown): SurveyConfigData[] => {
    if (Array.isArray(data)) {
        return data
            .map((item) => normalizeSurveyConfig(item))
            .filter((item): item is SurveyConfigData => !!item);
    }

    const single = normalizeSurveyConfig(data);
    return single ? [single] : [];
};

const parseSchema = (schema: unknown): Record<string, unknown> | null => {
    if (schema && typeof schema === "object") return schema as Record<string, unknown>;
    if (typeof schema === "string") {
        try {
            return JSON.parse(schema) as Record<string, unknown>;
        } catch {
            return null;
        }
    }
    return null;
};

const titleLocaleHint = (title?: string) => {
    if (!title) return null;
    const t = title.toLowerCase();
    if (
        t.includes("(kz)") ||
        t.includes("(kk)") ||
        t.includes("kz") ||
        t.includes("kk") ||
        t.includes("қаз") ||
        t.includes("каз")
    ) {
        return "kz";
    }
    if (t.includes("(ru)") || t.includes("ru") || t.includes("рус")) {
        return "ru";
    }
    return null;
};

export const matchSurveyConfigLocale = (
    config: SurveyConfigData,
    target: string
) => {
    const locale = config.locale?.toLowerCase();
    if (!locale) {
        const hint = titleLocaleHint(config.title);
        if (!hint) return false;
        return localeMatches(hint, target);
    }
    return localeMatches(locale, target);
};

const localeMatches = (candidate: string, target: string) => {
    const cand = candidate.toLowerCase();
    const targ = target.toLowerCase();
    if (cand === targ) return true;
    if (cand.startsWith(targ)) return true;
    if ((targ === "kz" && cand === "kk") || (targ === "kk" && cand === "kz")) {
        return true;
    }
    return false;
};

// Public — для загрузки вопросов на форме (без токена)
export async function fetchActiveSurveyConfig(locale: string) {
    const res = await publicApi.get<StrapiListResponse>(
        "/survey-configs?pagination[pageSize]=100"
    );
    const configs = normalizeSurveyConfigList(res.data.data);
    const active = configs.filter((c) => c.isActive !== false);

    let match =
        active.find((c) => matchSurveyConfigLocale(c, locale)) ??
        configs.find((c) => matchSurveyConfigLocale(c, locale)) ??
        active[0] ??
        configs[0] ??
        null;

    if (match?.schema) {
                const parsed = parseSchema(match.schema);
                if (parsed) {
                    match = {
                        ...match,
                        schema: normalizeDepartmentChoicesInSchema(parsed, locale),
                    };
                }
            }

    return match;
}

// Authenticated — для админ-панели (с токеном)
export async function fetchSurveyConfigsAuth() {
    const res = await api.get<StrapiListResponse>(
        "/survey-configs?pagination[pageSize]=100"
    );
    return normalizeSurveyConfigList(res.data.data).map((config) => {
        const parsed = parseSchema(config.schema);
        if (!parsed) return config;
        return {
            ...config,
            schema: normalizeDepartmentChoicesInSchema(parsed, config.locale),
        };
    });
}

export async function createSurveyConfig(data: {
    title: string;
    locale: string;
    schema: Record<string, unknown>;
    isActive?: boolean;
    version?: string;
    notes?: string;
}) {
    const res = await api.post<StrapiSingleResponse>("/survey-configs", {
        data,
    });
    return normalizeSurveyConfig(res.data.data);
}

export async function updateSurveyConfig(
    idOrDocumentId: string | number,
    data: {
        title?: string;
        locale?: string;
        schema?: Record<string, unknown>;
        isActive?: boolean;
        version?: string;
        notes?: string;
    }
) {
    const res = await api.put<StrapiSingleResponse>(
        `/survey-configs/${idOrDocumentId}`,
        { data }
    );
    return normalizeSurveyConfig(res.data.data);
}

export async function deleteSurveyConfig(documentId: string) {
    await api.delete(`/survey-configs/${documentId}`);
}
