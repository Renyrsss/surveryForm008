export default async function acceptDataToServer(dataStr: any) {
    const headers = new Headers({
        "Content-Type": "application/json; charset=utf-8",
    });

    const response = await fetch("http://192.168.101.25:1339/api/data-quests", {
        method: "POST",
        body: dataStr,
        headers: headers,
    });

    if (!response.ok) {
        throw new Error("Could not post the survey results");
    }

    return response.json(); // вернём результат, если надо
}
