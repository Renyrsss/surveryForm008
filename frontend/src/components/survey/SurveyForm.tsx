import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "survey-core/survey-core.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/i18n/russian";
import "survey-core/i18n/kazakh";
import surveyStore from "../../stores/surveyStore";
import { submitSurvey } from "../../api/surveys";
import { surveyJsonRu } from "../../data/surveyRu";
import { surveyJsonKz } from "../../data/surveyKz";

const SurveyForm = observer(() => {
    const { t } = useTranslation();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Give animation time to complete
        const timer = setTimeout(() => setIsReady(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const survey = useMemo(() => {
        const locale = surveyStore.locale;
        const schema = locale === "ru" ? surveyJsonRu : surveyJsonKz;
        const model = new Model(schema);

        model.locale = locale === "ru" ? "ru" : "kk";

        model.onComplete.add(async (sender, options) => {
            options.showSaveInProgress();

            try {
                await submitSurvey({
                    dataJson: sender.data,
                    type: sender.data["отдел"] || "",
                });
                options.showSaveSuccess(t("survey.success"));
                setTimeout(() => window.location.reload(), 2500);
            } catch {
                options.showSaveError(t("survey.error"));
            }
        });

        return model;
    }, [surveyStore.locale, t]);

    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="py-8">
            <Survey model={survey} />
        </div>
    );
});

export default SurveyForm;
