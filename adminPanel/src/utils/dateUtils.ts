// Утилиты для фильтрации по датам

export function getMonth(date: string) {
    return date.slice(0, 7); // "2025-04"
}

export function getQuarter(date: string) {
    const [year, month] = date.split("-").map(Number);
    const quarter = Math.ceil(month / 3);
    return `${year}-Q${quarter}`;
}

export function getYear(date: string) {
    return date.slice(0, 4);
}
