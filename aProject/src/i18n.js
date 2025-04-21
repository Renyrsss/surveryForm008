import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    ru: {
        translation: {
            h1: "Анкета удовлетворенности пациента качеством оказанных услуг",
            title: "Уважаемый пациент! В целях совершенствования качества услуг руководство клиники просит заполнить анкету. Анонимность гарантируется. Необходимо указать выбранную Вами оценку по 10 балльной шкале, либо подчеркнуть, где необходимо. От 1 до 7 оценка считается неудовлетворительной. От 8 до 10 удовлетворительной. Заполненную анкету просим опустить в ящик для сбора анкет",
            langkz: "Казахский",
            langru: "Русский",
            agree: "Согласен",
        },
    },
    kz: {
        translation: {
            h1: "Көрсетілетін қызметтердің сапасына пациенттердің қанағаттану сауалнамасы",
            title: "Құрметті пациент! Қызмет көрсету сапасын арттыру мақсатында емхана басшылығы сауалнама толтыруыңызды сұрайды. Анонимділікке кепілдік беріледі. Сіз таңдаған рейтингіңізді 10 балдық жүйеде көрсетуіңіз керек немесе қажет болған жағдайда астын сызуыңыз керек. 1-ден 7-ге дейінгі балл қанағаттанарлықсыз деп саналады. 8-ден 10-ға дейін қанағаттанарлық. Толтырылған сауалнаманы сауалнаманы жинау жолағына тастаңыз.",
            langkz: "Қазақша",
            langru: "Орысша",
            agree: "Келісемін",
        },
    },
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "ru", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
