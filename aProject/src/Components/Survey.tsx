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
    survey.locale = "ru";

    survey.onComplete.add((survey, options) => {
        options.showSaveInProgress();
        const dataObj = survey.data;
        console.log(survey.data);

        const dataToFetch = {
            data: {
                dataJson: dataObj,
                type: survey.data["отдел"],
            },
        };
        const dataStr = JSON.stringify(dataToFetch);
        acceptDataToServer(dataStr, options);
    });
    return <Survey model={survey} />;
});

export default SurveyComponent;
