import { makeAutoObservable } from "mobx";

class DataStore {
    constructor() {
        makeAutoObservable(this);
    }

    dataJsons = [];
    surveryCount = null;
    yesNoTotal = {
        Да: 0,
        Нет: 0,
    };

    setYesNoTotal(yes: number, no: number) {
        this.yesNoTotal = { Да: yes, Нет: no };
    }
}

export default new DataStore();
