import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowRight, Heart } from "lucide-react";
import surveyStore from "../../stores/surveyStore";

const WelcomeModal = observer(() => {
    const { t, i18n } = useTranslation();

    const changeLocale = (locale: string) => {
        surveyStore.setLocale(locale);
        i18n.changeLanguage(locale);
    };

    return (
        <AnimatePresence>
            {surveyStore.showWelcome && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => surveyStore.closeWelcome()}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-sky-500 to-teal-500 px-6 py-8 text-white text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <h1 className="text-2xl font-bold mb-1">
                                    {t("welcome.title")}
                                </h1>
                                <p className="text-white/80">
                                    {t("welcome.subtitle")}
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Language Selector */}
                                <div className="flex items-center justify-center gap-2">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => changeLocale("ru")}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                surveyStore.locale === "ru"
                                                    ? "bg-white shadow text-sky-600"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            {t("welcome.langRu")}
                                        </button>
                                        <button
                                            onClick={() => changeLocale("kz")}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                surveyStore.locale === "kz"
                                                    ? "bg-white shadow text-sky-600"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            {t("welcome.langKz")}
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-center leading-relaxed">
                                    {t("welcome.description")}
                                </p>

                                {/* Scale Info */}
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                                    <p className="text-amber-800 text-sm text-center">
                                        {t("welcome.scale")}
                                    </p>
                                </div>

                                {/* Start Button */}
                                <button
                                    onClick={() => surveyStore.closeWelcome()}
                                    className="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-sky-200 transition-all"
                                >
                                    {t("welcome.start")}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default WelcomeModal;
