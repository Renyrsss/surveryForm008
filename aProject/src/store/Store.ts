import { makeAutoObservable } from "mobx";

class Store {
    constructor() {
        makeAutoObservable(this);
    }

    locale = "ru";
    isOpen = true;
}

export default new Store();
