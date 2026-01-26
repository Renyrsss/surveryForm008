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
    const res = await api.get<StrapiListResponse>(
        "/access-codes?pagination[pageSize]=100&sort=createdAt:desc"
    );
    return normalizeAccessCodeList(res.data.data);
}

export async function createAccessCode(data: {
    code: string;
    label?: string;
    isActive?: boolean;
    expiresAt?: string | null;
    maxUses?: number | null;
}) {
    const res = await api.post<StrapiSingleResponse>("/access-codes", {
        data,
    });
    return normalizeAccessCode(res.data.data);
}

export async function updateAccessCode(
    idOrDocumentId: string | number,
    data: Partial<AccessCode>
) {
    const res = await api.put<StrapiSingleResponse>(
        `/access-codes/${idOrDocumentId}`,
        { data }
    );
    return normalizeAccessCode(res.data.data);
}
