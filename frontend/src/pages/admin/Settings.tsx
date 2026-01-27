import { motion } from "framer-motion";
import { ExternalLink, Server, Key, FileText, Plus, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    createAccessCode,
    fetchAccessCodes,
    updateAccessCode,
    type AccessCode,
} from "../../api/accessCodes";

// Dev: localhost:1339, Prod: form008.nnmc.kz
const strapiAdminUrl = import.meta.env.PROD
    ? "https://form008.nnmc.kz/admin"
    : "http://localhost:1339/admin";

const buildRandomCode = () => {
    const digits = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 10)
    ).join("");
    return digits;
};

export default function Settings() {
    const [codes, setCodes] = useState<AccessCode[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({
        code: "",
        label: "",
        expiresAt: "",
        maxUses: "",
        isActive: true,
    });

    const canSubmit = useMemo(() => form.code.trim() !== "", [form.code]);

    const loadCodes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const list = await fetchAccessCodes();
            setCodes(list);
        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить PIN-коды");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCodes();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setCreating(true);
        setError(null);
        try {
            const created = await createAccessCode({
                code: form.code.trim(),
                label: form.label.trim() || undefined,
                isActive: form.isActive,
                expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
                maxUses: form.maxUses ? Number(form.maxUses) : null,
            });
            if (created) {
                setCodes((prev) => [created, ...prev]);
                setForm({
                    code: "",
                    label: "",
                    expiresAt: "",
                    maxUses: "",
                    isActive: true,
                });
            }
        } catch (err) {
            console.error(err);
            setError("Не удалось создать PIN-код");
        } finally {
            setCreating(false);
        }
    };

    const handleDeactivate = async (code: AccessCode) => {
        if (!code) return;
        const id = code.documentId ?? code.id;
        try {
            const updated = await updateAccessCode(id, { isActive: false });
            if (updated) {
                setCodes((prev) =>
                    prev.map((c) =>
                        c.id === code.id ? { ...c, isActive: false } : c
                    )
                );
            }
        } catch (err) {
            console.error(err);
            setError("Не удалось отключить PIN-код");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Настройки</h1>
                <p className="text-slate-500">Управление системой опросов</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PIN Codes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 lg:col-span-2"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Key className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    PIN-коды
                                </h2>
                                <button
                                    onClick={loadCodes}
                                    disabled={isLoading}
                                    className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                                    title="Обновить"
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                                    />
                                </button>
                            </div>
                            <p className="text-sm text-slate-500">
                                Управление доступом к опросу
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-3 mb-5">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, code: e.target.value }))
                                }
                                placeholder="PIN-код"
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setForm((prev) => ({ ...prev, code: buildRandomCode() }))
                                }
                                className="px-3 py-2 text-sm bg-amber-50 text-amber-700 rounded-xl border border-amber-200 hover:bg-amber-100"
                            >
                                Сгенерировать
                            </button>
                        </div>
                        <input
                            type="text"
                            value={form.label}
                            onChange={(e) =>
                                setForm((prev) => ({ ...prev, label: e.target.value }))
                            }
                            placeholder="Описание (необязательно)"
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                                type="datetime-local"
                                value={form.expiresAt}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, expiresAt: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                            />
                            <input
                                type="number"
                                min={1}
                                value={form.maxUses}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, maxUses: e.target.value }))
                                }
                                placeholder="Лимит использований"
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        isActive: e.target.checked,
                                    }))
                                }
                                className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                            />
                            Активный
                        </label>
                        <button
                            type="submit"
                            disabled={!canSubmit || creating}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50"
                        >
                            {creating ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            Создать PIN
                        </button>
                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}
                    </form>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {codes.length === 0 ? (
                            <div className="text-sm text-slate-500">
                                PIN-кодов пока нет
                            </div>
                        ) : (
                            codes.map((code) => (
                                <div
                                    key={code.id}
                                    className="flex items-start justify-between gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-sm font-semibold text-slate-900">
                                                {code.code}
                                            </span>
                                            {!code.isActive && (
                                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                                                    неактивен
                                                </span>
                                            )}
                                        </div>
                                        {code.label && (
                                            <div className="text-xs text-slate-500">
                                                {code.label}
                                            </div>
                                        )}
                                        <div className="text-xs text-slate-400">
                                            Использований: {code.usesCount ?? 0}
                                            {code.maxUses
                                                ? ` / ${code.maxUses}`
                                                : ""}
                                        </div>
                                    </div>
                                    {code.isActive && (
                                        <button
                                            onClick={() => handleDeactivate(code)}
                                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Отключить"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Survey Config */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
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

                {/* Strapi Admin */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
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

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl p-6 text-white lg:col-span-2"
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
