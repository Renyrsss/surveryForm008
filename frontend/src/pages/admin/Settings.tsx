import { motion } from "framer-motion";
import { ExternalLink, Server, Key, FileText } from "lucide-react";

// В dev: localhost:1337, в prod: /server
const strapiAdminUrl = import.meta.env.PROD
    ? "/server/admin"
    : "http://localhost:1339/admin";

export default function Settings() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Настройки</h1>
                <p className="text-slate-500">Управление системой опросов</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Strapi Admin */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                            <Server className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Strapi Admin
                            </h2>
                            <p className="text-sm text-slate-500">
                                Управление контентом и данными
                            </p>
                        </div>
                    </div>
                    <p className="text-slate-600 mb-4">
                        Используйте панель администратора Strapi для управления
                        вопросами опроса, PIN-кодами и просмотра сырых данных.
                    </p>
                    <a
                        href={strapiAdminUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors"
                    >
                        Открыть Strapi
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </motion.div>

                {/* PIN Codes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Key className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                PIN-коды
                            </h2>
                            <p className="text-sm text-slate-500">
                                Управление доступом к опросу
                            </p>
                        </div>
                    </div>
                    <p className="text-slate-600 mb-4">
                        Создавайте и управляйте PIN-кодами для пациентов в
                        разделе Access Codes в Strapi.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-800">
                            <strong>Совет:</strong> Вы можете создавать коды с
                            ограничением по количеству использований и сроку
                            действия.
                        </p>
                    </div>
                </motion.div>

                {/* Survey Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Вопросы опроса
                            </h2>
                            <p className="text-sm text-slate-500">
                                Редактирование структуры опроса
                            </p>
                        </div>
                    </div>
                    <p className="text-slate-600 mb-4">
                        Вопросы опроса можно редактировать в разделе Survey
                        Configs в Strapi. Поддерживаются русский и казахский
                        языки.
                    </p>
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                        <p className="text-sm text-teal-800">
                            <strong>Формат:</strong> Используйте JSON-схему
                            SurveyJS для описания вопросов.
                        </p>
                    </div>
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl p-6 text-white"
                >
                    <h2 className="text-lg font-semibold mb-2">О системе</h2>
                    <p className="text-white/80 mb-4">
                        Система опроса пациентов NNMC
                    </p>
                    <ul className="space-y-2 text-sm text-white/90">
                        <li>• Опрос доступен на двух языках</li>
                        <li>• Доступ по PIN-коду</li>
                        <li>• Аналитика в реальном времени</li>
                        <li>• Экспорт в Excel</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
