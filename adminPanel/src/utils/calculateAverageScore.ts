// Подсчёт среднего балла из surveyResult

export function calculateAverageScore(
    surveyResult: Record<string, any>
): number {
    const values = Object.values(surveyResult).filter(
        (v) => typeof v === "number"
    );
    const total = values.reduce((sum, val) => sum + val, 0);
    return values.length ? +(total / values.length).toFixed(2) : 0;
}
