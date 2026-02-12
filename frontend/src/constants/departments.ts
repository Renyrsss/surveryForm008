export type DepartmentEntry = {
    value: string;
    ruLabel: string;
    kzLabel: string;
    aliases: string[];
};

export const DEPARTMENTS: DepartmentEntry[] = [
    {
        value: "Отдел кардиохирургии с реабилитацией",
        ruLabel: "Отдел кардиохирургии с реабилитацией",
        kzLabel: "Оңалтумен кардиохирургия бөлімі",
        aliases: ["КХО"],
    },
    {
        value: "Отдел общей и торакальной хирургии",
        ruLabel: "Отдел общей и торакальной хирургии",
        kzLabel: "Жалпы және кеуде хирургиясы бөлімі",
        aliases: ["ОХ и ТХ"],
    },
    {
        value: "Отдел терапии №2",
        ruLabel: "Отдел терапии №2",
        kzLabel: "№2 терапия бөлімі",
        aliases: ["Терапия 2", "Терапия2", "Терапия 2 "],
    },
    {
        value: "Отдел урологии",
        ruLabel: "Отдел урологии",
        kzLabel: "Урология бөлімі",
        aliases: ["Урология"],
    },
    {
        value: "Отдел интервенционной кардиологии № 2",
        ruLabel: "Отдел интервенционной кардиологии № 2",
        kzLabel: "№2 интервенциялық кардиология бөлімі",
        aliases: ["ИК-2", "ИК2"],
    },
    {
        value: "Отдел интервенционной кардиологии № 1",
        ruLabel: "Отдел интервенционной кардиологии № 1",
        kzLabel: "№1 интервенциялық кардиология бөлімі",
        aliases: ["ИК-1", "ИК1"],
    },
    {
        value: "Отдел гинекологии",
        ruLabel: "Отдел гинекологии",
        kzLabel: "Гинекология бөлімі",
        aliases: ["Гинекология"],
    },
    {
        value: "Отдел нейрохирургии",
        ruLabel: "Отдел нейрохирургии",
        kzLabel: "Нейрохирургия бөлімі",
        aliases: ["НХО"],
    },
    {
        value: "Детский кардиохирургический центр",
        ruLabel: "Детский кардиохирургический центр",
        kzLabel: "Балалар кардиохирургиялық орталығы",
        aliases: ["ДКХО"],
    },
    {
        value: "Отдел аритмологии",
        ruLabel: "Отдел аритмологии",
        kzLabel: "Аритмология бөлімі",
        aliases: ["Аритмология"],
    },
];

const departmentMap = new Map<string, DepartmentEntry>();

for (const department of DEPARTMENTS) {
    departmentMap.set(department.value, department);
    departmentMap.set(department.ruLabel, department);
    departmentMap.set(department.kzLabel, department);
    for (const alias of department.aliases) {
        departmentMap.set(alias, department);
    }
}

export const normalizeDepartment = (value?: string | null): string => {
    if (!value) return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    return departmentMap.get(trimmed)?.value ?? trimmed;
};

export const getDepartmentAliases = (value: string): string[] => {
    const normalized = normalizeDepartment(value);
    const department = departmentMap.get(normalized);
    if (!department) return [value];
    return Array.from(
        new Set([
            department.value,
            department.ruLabel,
            department.kzLabel,
            ...department.aliases,
        ])
    );
};

const toChoice = (department: DepartmentEntry, locale: string) => {
    if (locale === "kz" || locale === "kk") {
        return {
            value: department.value,
            text: department.kzLabel,
        };
    }
    return department.ruLabel;
};

export const normalizeDepartmentChoicesInSchema = (
    schema: Record<string, unknown>,
    locale: string
): Record<string, unknown> => {
    const cloned = JSON.parse(JSON.stringify(schema)) as Record<string, unknown>;
    const pages = cloned.pages;
    if (!Array.isArray(pages)) return cloned;

    for (const page of pages) {
        if (!page || typeof page !== "object") continue;
        const maybeElements = (page as { elements?: unknown }).elements;
        if (!Array.isArray(maybeElements)) continue;

        for (const element of maybeElements) {
            if (!element || typeof element !== "object") continue;
            const item = element as {
                type?: string;
                name?: string;
                choices?: unknown;
            };

            if (item.type !== "dropdown" || item.name !== "отдел") continue;
            if (!Array.isArray(item.choices)) continue;

            const normalized = new Map<string, DepartmentEntry>();
            for (const rawChoice of item.choices) {
                if (typeof rawChoice === "string") {
                    const key = normalizeDepartment(rawChoice);
                    const entry = DEPARTMENTS.find((d) => d.value === key);
                    if (entry) normalized.set(entry.value, entry);
                    continue;
                }

                if (rawChoice && typeof rawChoice === "object") {
                    const choice = rawChoice as { value?: unknown; text?: unknown };
                    const value =
                        typeof choice.value === "string"
                            ? choice.value
                            : typeof choice.text === "string"
                              ? choice.text
                              : "";
                    const key = normalizeDepartment(value);
                    const entry = DEPARTMENTS.find((d) => d.value === key);
                    if (entry) normalized.set(entry.value, entry);
                }
            }

            if (normalized.size === 0) {
                for (const department of DEPARTMENTS) {
                    normalized.set(department.value, department);
                }
            }

            item.choices = Array.from(normalized.values()).map((department) =>
                toChoice(department, locale)
            );
        }
    }

    return cloned;
};
