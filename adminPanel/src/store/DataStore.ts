import { makeAutoObservable } from "mobx";

class DataStore {
    constructor() {
        makeAutoObservable(this);
    }

    yesNoTotal = {
        Да: 0,
        Нет: 0,
    };

    setYesNoTotal(yes: number, no: number) {
        this.yesNoTotal = { Да: yes, Нет: no };
    }

    dataJsons: any[] = [];
    surveryCount: number = 0;
    url: string = "";
    side: string = "Все";
    startDate: string = "";
    endDate: string = "";
    setUrl(url: string) {
        this.url = url;
    }

    setSide(side: string) {
        this.side = side;
    }

    setStartDate(date: string) {
        this.startDate = date;
    }

    setEndDate(date: string) {
        this.endDate = date;
    }
}

export default new DataStore();
