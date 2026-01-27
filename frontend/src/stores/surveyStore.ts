import { makeAutoObservable } from "mobx";

class SurveyStore {
    locale = "ru";
    showWelcome = true;
    hasAccess = false;

    constructor() {
        makeAutoObservable(this);
        this.hasAccess = sessionStorage.getItem("surveyAccess") === "true";
    }

    setLocale(locale: string) {
        this.locale = locale;
    }

    closeWelcome() {
        this.showWelcome = false;
    }

    grantAccess() {
        this.hasAccess = true;
        sessionStorage.setItem("surveyAccess", "true");
    }
}

export default new SurveyStore();
