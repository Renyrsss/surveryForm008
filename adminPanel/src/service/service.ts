import axios from "axios";
import DataStore from "../store/DataStore";

async function getData(url = "http://localhost:1337/api/data-quests") {
    const data = [];
    const filterDataAt =
        "&filters[$and][0][createdAt][$gt]=2025-03-31T19:00:00.000Z&filters[$and][1][createdAt][$lte]=2025-04-29T19%3A00%3A00.000Z";
    await axios.get(url).then((res) => {
        // console.log(res.data.data[0].dataJson["surveyResult"]);
        DataStore.dataJsons = res.data.data;
        DataStore.surveryCount = res.data.meta.pagination.total;
        const dataS = res.data.data[0].dataJson["surveyResult"];
        Object.keys(dataS).forEach((key) => {
            // console.log(`${key} : ${dataS[key]}`);
        });
    });
}

// Принимает массив всех ответов и возвращает среднее значение по каждому вопросу
interface RawEntry {
    dataJson: Record<string, number>;
}

export function calculateAverageFromRawData(
    rawData: RawEntry[]
): Record<string, number> {
    const sumMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};

    rawData.forEach((entry) => {
        const answers = entry.dataJson;

        Object.entries(answers).forEach(([question, value]) => {
            if (typeof value === "number") {
                sumMap[question] = (sumMap[question] || 0) + value;
                countMap[question] = (countMap[question] || 0) + 1;
            }
        });
    });

    const averageMap: Record<string, number> = {};
    Object.keys(sumMap).forEach((question) => {
        averageMap[question] = parseFloat(
            (sumMap[question] / countMap[question]).toFixed(2)
        );
    });

    return averageMap;
}

type SurveyAnswer = string | number;
type DataEntry = {
    dataJson: Record<string, SurveyAnswer>;
};

type YesNoStats = {
    [question: string]: {
        Да: number;
        Нет: number;
    };
};

export function getYesNoStats(rawData: DataEntry[]): YesNoStats {
    const questionStats: YesNoStats = {};
    let totalYes = 0;
    let totalNo = 0;

    rawData.forEach((entry) => {
        const answers = entry.dataJson;

        Object.entries(answers).forEach(([question, answer]) => {
            if (answer === "Да" || answer === "Нет") {
                if (!questionStats[question]) {
                    questionStats[question] = { Да: 0, Нет: 0 };
                }

                const key = answer as "Да" | "Нет";
                questionStats[question][key]++;
                if (key === "Да") totalYes++;
                else if (key === "Нет") totalNo++;
            }
        });
    });

    // Обновляем MobX store
    // DataStore.setYesNoTotal(totalYes, totalNo);

    return questionStats;
}

export default getData;
