import api from "./client";

export type AccessCode = {
    id: number;
    documentId?: string;
    code: string;
    label?: string | null;
    isActive?: boolean;
    expiresAt?: string | null;
    maxUses?: number | null;
    usesCount?: number | null;
    lastUsedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

type StrapiListResponse = {
    data: AccessCode[];
    meta: {
        pagination: {
            page: number;
            pageCount: number;
            total: number;
        };
    };
};

type StrapiSingleResponse = {
    data: AccessCode;
};

const toNumber = (value: unknown): number | null => {
    return typeof value === "number" ? value : null;
};

const normalizeAccessCode = (item: unknown): AccessCode | null => {
    if (!item || typeof item !== "object") return null;
    const record = item as AccessCode & {
        attributes?: AccessCode;
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

const normalizeAccessCodeList = (data: unknown): AccessCode[] => {
    if (Array.isArray(data)) {
        return data
            .map((item) => normalizeAccessCode(item))
            .filter((item): item is AccessCode => !!item);
    }
    const single = normalizeAccessCode(data);
    return single ? [single] : [];
};

export async function fetchAccessCodes() {
    const [publishedRes, draftRes] = await Promise.all([
        api.get<StrapiListResponse>(
            "/access-codes?pagination[pageSize]=100&sort=createdAt:desc&status=published"
        ),
        api
            .get<StrapiListResponse>(
                "/access-codes?pagination[pageSize]=100&sort=createdAt:desc&status=draft"
            )
            .catch(() => null),
    ]);

    const combined = [
        ...normalizeAccessCodeList(publishedRes.data.data),
        ...(draftRes ? normalizeAccessCodeList(draftRes.data.data) : []),
    ];

    const merged = new Map<string, AccessCode>();
    combined.forEach((item) => {
        const key = item.documentId ?? item.code ?? String(item.id);
        const prev = merged.get(key);
        if (!prev) {
            merged.set(key, item);
            return;
        }

        merged.set(key, {
            ...prev,
            ...item,
            usesCount: Math.max(toNumber(prev.usesCount) ?? 0, toNumber(item.usesCount) ?? 0),
            maxUses: item.maxUses ?? prev.maxUses ?? null,
        });
    });

    return Array.from(merged.values()).sort((a, b) => {
        const aTime = new Date(a.createdAt ?? 0).getTime();
        const bTime = new Date(b.createdAt ?? 0).getTime();
        return bTime - aTime;
    });
}

export async function createAccessCode(data: {
    code: string;
    label?: string;
    isActive?: boolean;
    expiresAt?: string | null;
    maxUses?: number | null;
}) {
    const res = await api.post<StrapiSingleResponse>("/access-codes?status=published", {
        data,
    });
    return normalizeAccessCode(res.data.data);
}

export async function updateAccessCode(
    idOrDocumentId: string | number,
    data: Partial<AccessCode>
) {
    const res = await api.put<StrapiSingleResponse>(
        `/access-codes/${idOrDocumentId}?status=published`,
        { data }
    );
    return normalizeAccessCode(res.data.data);
}
