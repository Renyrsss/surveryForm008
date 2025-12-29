import axios from "axios";
import DataStore from "../store/DataStore";

export function buildUrl(): string {
    const base = "/api/data-quests";
    const filters = [];

    if (DataStore.startDate) {
        filters.push(
            `filters[$and][0][createdAt][$gt]=${encodeURIComponent(
                DataStore.startDate
            )}`
        );
    }

    if (DataStore.endDate) {
        filters.push(
            `filters[$and][1][createdAt][$lte]=${encodeURIComponent(
                DataStore.endDate
            )}`
        );
    }

    if (DataStore.side && DataStore.side !== "Все") {
        filters.push(
            `filters[type][$eq]=${encodeURIComponent(DataStore.side)}`
        );
    }

    if (filters.length === 0) return base;
    return `${base}?${filters.join("&")}`;
}

export async function getData() {
    const baseUrl = buildUrl();
    const separator = baseUrl.includes("?") ? "&" : "?";

    let page = 1;
    const pageSize = 100;
    let allData: any[] = [];
    let totalPages = 1;

    console.log("📡 Загружаем данные...");

    do {
        const url = `${baseUrl}${separator}pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
        const res = await axios.get(url);

        const data = res.data.data || [];
        const meta = res.data.meta?.pagination;
        totalPages = meta?.pageCount || 1;

        allData = allData.concat(data);
        console.log(
            `✅ Страница ${page}/${totalPages} загружена (${data.length} записей)`
        );

        page++;
    } while (page <= totalPages);

    console.log(`📊 Всего загружено: ${allData.length} записей`);
    DataStore.dataJsons = allData;
    DataStore.surveryCount = allData.length;
}

// export async function filtersSide(side: string) {
//     console.log(side);

//     if (side == "Все") {
//         getData();
//     } else {
//         await axios
//             .get(
//                 "http://192.168.101.25:1339/api/data-quests" +
//                     `?filters[type][$eq]=${side}`
//             )
//             .then((res) => {
//                 // console.log(res.data.data[0].dataJson["surveyResult"]);
//                 console.log(res.data.data);

//                 DataStore.dataJsons = res.data.data;
//                 DataStore.surveryCount = res.data.meta.pagination.total;
//                 // const dataS = res.data.data[0].dataJson["surveyResult"];
//                 // Object.keys(dataS).forEach((key) => {
//                 //     // console.log(`${key} : ${dataS[key]}`);
//                 // });
//             });
//     }
// }

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
