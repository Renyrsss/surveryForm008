// Подготовка данных для графика

import { calculateAverageScore } from "./calculateAverageScore";

export function prepareChartData(surveys: any[]) {
    return surveys.map((survey) => {
        const createdAt = new Date(survey.createdAt);
        const result = survey.dataJson?.surveyResult || survey.dataJson;

        return {
            date: createdAt.toISOString().slice(0, 10),
            department: result["отдел"] || survey.type,
            avgScore: calculateAverageScore(result),
        };
    });
}
