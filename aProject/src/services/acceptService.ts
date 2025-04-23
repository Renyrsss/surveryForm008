export default function acceptDataToServer(dataStr: any, options: any) {
    const headers = new Headers({
        "Content-Type": "application/json; charset=utf-8",
    });

    fetch("http://192.168.101.25:1339/api/data-quests", {
        method: "POST",
        body: dataStr,
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Could not post the survey results");
            }
            // Display the "Success" message (pass a string value to display a custom message)
            options.showSaveSuccess();
            // Alternatively, you can clear all messages:
            // options.clearSaveMessages();
        })
        .catch((error) => {
            // Display the "Error" message (pass a string value to display a custom message)
            options.showSaveError();
            console.log(error);
        });
}
