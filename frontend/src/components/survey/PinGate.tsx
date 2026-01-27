import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import surveyStore from "../../stores/surveyStore";
import { verifyPinCode } from "../../api/surveys";

export default function PinGate() {
    const { t } = useTranslation();
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setError("");

        try {
            const result = await verifyPinCode(code.trim());
            if (result.ok) {
                surveyStore.grantAccess();
            } else {
                setError(t("pin.error"));
            }
        } catch {
            setError(t("pin.error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-teal-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-xl shadow-sky-100/50 p-8 border border-sky-100">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                        {t("pin.title")}
                    </h1>
                    <p className="text-gray-500 text-center mb-8">
                        {t("pin.subtitle")}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={t("pin.placeholder")}
                                disabled={loading}
                                className="w-full px-4 py-4 text-center text-2xl font-mono tracking-widest bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-sky-400 focus:bg-white transition-all disabled:opacity-50"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl"
                            >
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">{error}</span>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !code.trim()}
                            className="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-sky-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t("pin.submit")}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
