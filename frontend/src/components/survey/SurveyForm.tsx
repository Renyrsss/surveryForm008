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
import { fetchActiveSurveyConfig } from "../../api/surveyConfig";
import { normalizeDepartment } from "../../constants/departments";

const SurveyForm = observer(() => {
    const { t } = useTranslation();
    const [isReady, setIsReady] = useState(false);
    const [schemaData, setSchemaData] = useState<Record<string, unknown> | null>(null);
    const [schemaLoading, setSchemaLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    // Load schema from API
    useEffect(() => {
        let cancelled = false;
        const locale = surveyStore.locale;

        (async () => {
            setSchemaLoading(true);
            setLoadError(false);
            try {
                const config = await fetchActiveSurveyConfig(locale);
                if (!cancelled) {
                    if (config?.schema) {
                        setSchemaData(config.schema);
                    } else {
                        setLoadError(true);
                    }
                }
            } catch {
                if (!cancelled) setLoadError(true);
            } finally {
                if (!cancelled) setSchemaLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [surveyStore.locale]);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const survey = useMemo(() => {
        if (schemaLoading || !schemaData) return null;

        const locale = surveyStore.locale;
        const model = new Model(schemaData);

        model.locale = locale === "ru" ? "ru" : "kk";

        model.onComplete.add(async (sender, options) => {
            options.showSaveInProgress();

            try {
                await submitSurvey({
                    dataJson: sender.data,
                    type: normalizeDepartment(String(sender.data["отдел"] || "")),
                });
                options.showSaveSuccess(t("survey.success"));
                setTimeout(() => window.location.reload(), 2500);
            } catch {
                options.showSaveError(t("survey.error"));
            }
        });

        return model;
    }, [surveyStore.locale, schemaData, schemaLoading, t]);

    if (!isReady || schemaLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (loadError || !survey) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md px-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        Опрос временно недоступен
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Не удалось загрузить вопросы. Попробуйте обновить страницу или обратитесь к администратору.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors text-sm"
                    >
                        Обновить страницу
                    </button>
                </div>
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
