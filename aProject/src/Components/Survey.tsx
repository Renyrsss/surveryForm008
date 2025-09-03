// components/Survey.tsx
"use client";

import "survey-core/survey-core.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { surveyJsonRu } from "../services/data";
import { surveyJsonKz } from "../services/dataKz";

import "survey-core/i18n/russian";
import "survey-core/i18n/kazakh";

import acceptDataToServer from "../services/acceptService";
import { observer } from "mobx-react-lite";
import Store from "../store/Store";

const SurveyComponent = observer(() => {
    const survey = new Model(
        Store.locale == "ru" ? surveyJsonRu : surveyJsonKz
    );
    survey.locale = Store.locale === "ru" ? "ru" : "kk";

    survey.onComplete.add(async (survey, options) => {
        const dataObj = survey.data;

        const dataToFetch = {
            data: {
                dataJson: dataObj,
                type: survey.data["отдел"],
            },
        };
        const dataStr = JSON.stringify(dataToFetch);

        options.showSaveInProgress(); // показываем "идет отправка..."

        try {
            await acceptDataToServer(dataStr);
            const success =
                Store.locale === "ru"
                    ? "✅ Данные успешно отправлены!"
                    : "✅ Деректер сәтті жіберілді!";
            options.showSaveSuccess(success);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Ошибка при отправке:", error);
            const errText =
                Store.locale === "ru"
                    ? "❌ Не удалось отправить данные."
                    : "❌ Деректер жіберілмеді";
            options.showSaveError(errText);
        }
    });

    return <Survey model={survey} />;
});

export default SurveyComponent;
