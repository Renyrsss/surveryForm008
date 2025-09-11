import axios from "axios";

const _TOKEN: string = "6515245927:AAExFk8USVwQ2IVcwtqszfutM-hqgbfp0Dg";
const _BOTAPI: string = `https://api.telegram.org/bot${_TOKEN}/sendMessage`;
async function botSend(payload: {
    FIO: string;
    IIN: string;
    phone: string;
    email: string;
}) {
    let massage: string = `<b>Фамилия:</b> ${payload.FIO}\n<b>Фамилия:</b> ${payload.IIN}\n<b>Фамилия:</b> ${payload.phone}\n<b>Фамилия:</b> ${payload.email}`;

    try {
        await axios
            .post(_BOTAPI, {
                chat_id: "-41",
                parse_mode: "html",
                text: massage,
            })
            .then((res) => {
                console.log(res);
            });
    } catch (e) {
        console.log(e);
    }
}

export default botSend;
