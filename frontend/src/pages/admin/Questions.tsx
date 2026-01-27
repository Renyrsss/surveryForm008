import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Save,
    Trash2,
    Edit3,
    ChevronUp,
    ChevronDown,
    ChevronRight,
    FileText,
    Star,
    List,
    MessageSquare,
    CircleDot,
    Loader2,
    X,
    GripVertical,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import {
    fetchSurveyConfigsAuth,
    createSurveyConfig,
    updateSurveyConfig,
    matchSurveyConfigLocale,
    type SurveyConfigData,
} from "../../api/surveyConfig";

// --- Types ---

type QuestionType = "rating" | "radiogroup" | "dropdown" | "comment";

type SurveyQuestion = {
    type: QuestionType;
    name: string;
    title: string;
    isRequired?: boolean;
    // rating
    rateCount?: number;
    rateMin?: number;
    rateMax?: number;
    defaultValue?: unknown;
    minRateDescription?: string;
    maxRateDescription?: string;
    // radiogroup / dropdown
    choices?: string[];
    colCount?: number;
    placeholder?: string;
    // comment
    rows?: number;
};

type SurveyPage = {
    name: string;
    title?: string;
    elements: SurveyQuestion[];
};

type SurveySchema = {
    showProgressBar?: string;
    progressBarType?: string;
    pageNextText?: string;
    pagePrevText?: string;
    completeText?: string;
    pages: SurveyPage[];
};

// --- Constants ---

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    rating: "Рейтинг (1-10)",
    radiogroup: "Выбор одного",
    dropdown: "Выпадающий список",
    comment: "Комментарий",
};

const QUESTION_TYPE_ICONS: Record<QuestionType, typeof Star> = {
    rating: Star,
    radiogroup: CircleDot,
    dropdown: List,
    comment: MessageSquare,
};

const DEFAULT_QUESTION: Record<QuestionType, Partial<SurveyQuestion>> = {
    rating: {
        isRequired: true,
        rateCount: 10,
        rateMin: 1,
        rateMax: 10,
        defaultValue: 10,
    },
    radiogroup: {
        isRequired: true,
        choices: ["Вариант 1", "Вариант 2"],
    },
    dropdown: {
        isRequired: true,
        choices: ["Вариант 1", "Вариант 2"],
        placeholder: "Выберите...",
    },
    comment: {
        isRequired: false,
        rows: 4,
    },
};

// --- Helper to deep clone ---
function cloneSchema(schema: SurveySchema): SurveySchema {
    return JSON.parse(JSON.stringify(schema));
}

// --- Question Edit Modal ---

function QuestionEditModal({
    question,
    onSave,
    onClose,
}: {
    question: SurveyQuestion | null;
    onSave: (q: SurveyQuestion) => void;
    onClose: () => void;
}) {
    const isNew = question === null;
    const [form, setForm] = useState<SurveyQuestion>(
        question ?? {
            type: "rating",
            name: "",
            title: "",
            ...DEFAULT_QUESTION["rating"],
        }
    );
    const [choiceInput, setChoiceInput] = useState("");

    const updateField = <K extends keyof SurveyQuestion>(
        key: K,
        value: SurveyQuestion[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleTypeChange = (type: QuestionType) => {
        setForm((prev) => ({
            ...prev,
            type,
            ...DEFAULT_QUESTION[type],
        }));
    };

    const addChoice = () => {
        const val = choiceInput.trim();
        if (!val) return;
        updateField("choices", [...(form.choices ?? []), val]);
        setChoiceInput("");
    };

    const removeChoice = (idx: number) => {
        updateField(
            "choices",
            (form.choices ?? []).filter((_, i) => i !== idx)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.title.trim()) return;
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {isNew ? "Новый вопрос" : "Редактирование вопроса"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-lg"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Тип вопроса
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(
                                Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]
                            ).map((t) => {
                                const Icon = QUESTION_TYPE_ICONS[t];
                                return (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => handleTypeChange(t)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                                            form.type === t
                                                ? "bg-sky-100 text-sky-700 ring-2 ring-sky-500"
                                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {QUESTION_TYPE_LABELS[t]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Имя (идентификатор)
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="Например: Регистратура"
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                            required
                        />
                        <p className="text-xs text-slate-400 mt-1">
                            Уникальное имя для идентификации в данных
                        </p>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Текст вопроса
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) =>
                                updateField("title", e.target.value)
                            }
                            placeholder="Например: Оцените работу регистратуры"
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                            required
                        />
                    </div>

                    {/* isRequired */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isRequired ?? false}
                            onChange={(e) =>
                                updateField("isRequired", e.target.checked)
                            }
                            className="w-4 h-4 text-sky-500 border-slate-300 rounded focus:ring-sky-500"
                        />
                        <span className="text-sm text-slate-700">
                            Обязательный вопрос
                        </span>
                    </label>

                    {/* Rating fields */}
                    {form.type === "rating" && (
                        <div className="space-y-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <p className="text-sm font-medium text-amber-800">
                                Настройки рейтинга
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">
                                        Мин
                                    </label>
                                    <input
                                        type="number"
                                        value={form.rateMin ?? 1}
                                        onChange={(e) =>
                                            updateField(
                                                "rateMin",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">
                                        Макс
                                    </label>
                                    <input
                                        type="number"
                                        value={form.rateMax ?? 10}
                                        onChange={(e) =>
                                            updateField(
                                                "rateMax",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">
                                        По умолч.
                                    </label>
                                    <input
                                        type="number"
                                        value={
                                            (form.defaultValue as number) ?? 10
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                "defaultValue",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">
                                        Подпись мин
                                    </label>
                                    <input
                                        type="text"
                                        value={form.minRateDescription ?? ""}
                                        onChange={(e) =>
                                            updateField(
                                                "minRateDescription",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Плохо"
                                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">
                                        Подпись макс
                                    </label>
                                    <input
                                        type="text"
                                        value={form.maxRateDescription ?? ""}
                                        onChange={(e) =>
                                            updateField(
                                                "maxRateDescription",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Отлично"
                                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Choices for radiogroup / dropdown */}
                    {(form.type === "radiogroup" || form.type === "dropdown") && (
                        <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm font-medium text-blue-800">
                                Варианты ответов
                            </p>
                            <div className="space-y-2">
                                {(form.choices ?? []).map((c, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2"
                                    >
                                        <GripVertical className="w-4 h-4 text-slate-300" />
                                        <span className="flex-1 text-sm text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                            {c}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeChoice(idx)}
                                            className="p-1 text-red-400 hover:text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={choiceInput}
                                    onChange={(e) =>
                                        setChoiceInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addChoice();
                                        }
                                    }}
                                    placeholder="Добавить вариант..."
                                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                />
                                <button
                                    type="button"
                                    onClick={addChoice}
                                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {form.type === "radiogroup" && (
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">
                                        Колонок
                                    </label>
                                    <input
                                        type="number"
                                        value={form.colCount ?? 0}
                                        onChange={(e) =>
                                            updateField(
                                                "colCount",
                                                Number(e.target.value)
                                            )
                                        }
                                        min={0}
                                        max={5}
                                        className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">
                                        0 = авто
                                    </p>
                                </div>
                            )}

                            {form.type === "dropdown" && (
                                <div>
                                    <label className="block text-xs text-slate-600 mb-1">
                                        Плейсхолдер
                                    </label>
                                    <input
                                        type="text"
                                        value={form.placeholder ?? ""}
                                        onChange={(e) =>
                                            updateField(
                                                "placeholder",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            )}

                            {/* Default value for radiogroup */}
                            {form.type === "radiogroup" &&
                                (form.choices ?? []).length > 0 && (
                                    <div>
                                        <label className="block text-xs text-slate-600 mb-1">
                                            Значение по умолчанию
                                        </label>
                                        <select
                                            value={
                                                (form.defaultValue as string) ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                updateField(
                                                    "defaultValue",
                                                    e.target.value || undefined
                                                )
                                            }
                                            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                        >
                                            <option value="">
                                                Нет
                                            </option>
                                            {(form.choices ?? []).map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                        </div>
                    )}

                    {/* Comment fields */}
                    {form.type === "comment" && (
                        <div className="space-y-3 bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-sm font-medium text-green-800">
                                Настройки комментария
                            </p>
                            <div>
                                <label className="block text-xs text-slate-600 mb-1">
                                    Количество строк
                                </label>
                                <input
                                    type="number"
                                    value={form.rows ?? 4}
                                    onChange={(e) =>
                                        updateField(
                                            "rows",
                                            Number(e.target.value)
                                        )
                                    }
                                    min={1}
                                    max={20}
                                    className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-sky-500 text-white rounded-xl hover:bg-sky-600 flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {isNew ? "Добавить" : "Сохранить"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

// --- Page Title Edit Modal ---

function PageEditModal({
    page,
    onSave,
    onClose,
}: {
    page: { name: string; title: string };
    onSave: (name: string, title: string) => void;
    onClose: () => void;
}) {
    const [name, setName] = useState(page.name);
    const [title, setTitle] = useState(page.title);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
            >
                <h3 className="text-lg font-semibold text-slate-900">
                    Редактирование страницы
                </h3>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Имя (идентификатор)
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Заголовок страницы
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Необязательно"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => onSave(name, title)}
                        className="px-4 py-2 text-sm bg-sky-500 text-white rounded-xl hover:bg-sky-600"
                    >
                        Сохранить
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// --- Main Component ---

export default function Questions() {
    const [activeTab, setActiveTab] = useState<"ru" | "kz">("ru");
    const [configs, setConfigs] = useState<Record<string, SurveyConfigData | null>>({
        ru: null,
        kz: null,
    });
    const [schema, setSchema] = useState<SurveySchema | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Modals
    const [editingQuestion, setEditingQuestion] = useState<{
        pageIdx: number;
        questionIdx: number | null;
        question: SurveyQuestion | null;
    } | null>(null);
    const [editingPage, setEditingPage] = useState<{
        pageIdx: number;
        name: string;
        title: string;
    } | null>(null);
    const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set());

    const showToast = useCallback(
        (type: "success" | "error", message: string) => {
            setToast({ type, message });
            setTimeout(() => setToast(null), 3000);
        },
        []
    );

    // Load configs
    const loadConfigs = useCallback(async () => {
        setLoading(true);
        try {
            const all = await fetchSurveyConfigsAuth();
            const ruConfig =
                all.find(
                    (c) => matchSurveyConfigLocale(c, "ru") && c.isActive
                ) ?? null;
            const kzConfig =
                all.find(
                    (c) => matchSurveyConfigLocale(c, "kz") && c.isActive
                ) ?? null;
            setConfigs({ ru: ruConfig, kz: kzConfig });
        } catch (err) {
            console.error("Failed to load configs", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadConfigs();
    }, [loadConfigs]);

    // When tab or configs change, load schema
    useEffect(() => {
        const config = configs[activeTab];
        if (config) {
            setSchema(cloneSchema(config.schema as unknown as SurveySchema));
        } else {
            setSchema(null);
        }
        setHasChanges(false);
    }, [activeTab, configs]);

    // Expand all pages by default when schema loads
    useEffect(() => {
        if (schema) {
            setExpandedPages(new Set(schema.pages.map((_, i) => i)));
        }
    }, [schema]);

    // Create empty survey config
    const handleCreateEmpty = async () => {
        setSaving(true);
        try {
            const title =
                activeTab === "ru"
                    ? "Опрос пациентов (RU)"
                    : "Пациенттерге сауалнама (KZ)";

            const emptySchema = {
                showProgressBar: "top",
                progressBarType: "questions",
                pageNextText: activeTab === "ru" ? "Далее" : "Келесі",
                pagePrevText: activeTab === "ru" ? "Назад" : "Артқа",
                completeText: activeTab === "ru" ? "Отправить" : "Жіберу",
                pages: [
                    {
                        name: "page_1",
                        title: activeTab === "ru" ? "Новая страница" : "Жаңа бет",
                        elements: [],
                    },
                ],
            };

            const created = await createSurveyConfig({
                title,
                locale: activeTab,
                schema: emptySchema as unknown as Record<string, unknown>,
                isActive: true,
                version: "1.0",
            });

            setConfigs((prev) => ({ ...prev, [activeTab]: created }));
            showToast("success", "Конфигурация создана");
        } catch (err) {
            console.error(err);
            showToast("error", "Ошибка при создании конфигурации");
        } finally {
            setSaving(false);
        }
    };

    // Save schema to API
    const handleSave = async () => {
        if (!schema) return;
        const config = configs[activeTab];
        const targetId = config?.documentId ?? config?.id;
        if (!targetId) return;

        setSaving(true);
        try {
            await updateSurveyConfig(targetId, {
                schema: schema as unknown as Record<string, unknown>,
            });
            setHasChanges(false);
            showToast("success", "Изменения сохранены");
            await loadConfigs();
        } catch (err) {
            console.error(err);
            showToast("error", "Ошибка при сохранении");
        } finally {
            setSaving(false);
        }
    };

    // --- Schema manipulation ---

    const updateSchema = (updater: (s: SurveySchema) => void) => {
        if (!schema) return;
        const next = cloneSchema(schema);
        updater(next);
        setSchema(next);
        setHasChanges(true);
    };

    // Page operations
    const addPage = () => {
        updateSchema((s) => {
            s.pages.push({
                name: `page_${s.pages.length + 1}`,
                title: "Новая страница",
                elements: [],
            });
        });
    };

    const removePage = (pageIdx: number) => {
        updateSchema((s) => {
            s.pages.splice(pageIdx, 1);
        });
    };

    const movePageUp = (pageIdx: number) => {
        if (pageIdx <= 0) return;
        updateSchema((s) => {
            [s.pages[pageIdx - 1], s.pages[pageIdx]] = [
                s.pages[pageIdx],
                s.pages[pageIdx - 1],
            ];
        });
    };

    const movePageDown = (pageIdx: number) => {
        if (!schema || pageIdx >= schema.pages.length - 1) return;
        updateSchema((s) => {
            [s.pages[pageIdx], s.pages[pageIdx + 1]] = [
                s.pages[pageIdx + 1],
                s.pages[pageIdx],
            ];
        });
    };

    const savePageEdit = (name: string, title: string) => {
        if (editingPage === null) return;
        updateSchema((s) => {
            s.pages[editingPage.pageIdx].name = name;
            s.pages[editingPage.pageIdx].title = title;
        });
        setEditingPage(null);
    };

    // Question operations
    const addQuestion = (pageIdx: number) => {
        setEditingQuestion({ pageIdx, questionIdx: null, question: null });
    };

    const editQuestion = (pageIdx: number, questionIdx: number) => {
        if (!schema) return;
        const q = schema.pages[pageIdx].elements[questionIdx];
        setEditingQuestion({
            pageIdx,
            questionIdx,
            question: { ...q } as SurveyQuestion,
        });
    };

    const saveQuestion = (q: SurveyQuestion) => {
        if (!editingQuestion) return;
        const { pageIdx, questionIdx } = editingQuestion;

        // Build clean question object
        const clean: SurveyQuestion = {
            type: q.type,
            name: q.name,
            title: q.title,
        };
        if (q.isRequired) clean.isRequired = true;
        if (q.type === "rating") {
            clean.rateCount = (q.rateMax ?? 10) - (q.rateMin ?? 1) + 1;
            clean.rateMin = q.rateMin ?? 1;
            clean.rateMax = q.rateMax ?? 10;
            if (q.defaultValue !== undefined) clean.defaultValue = q.defaultValue;
            if (q.minRateDescription)
                clean.minRateDescription = q.minRateDescription;
            if (q.maxRateDescription)
                clean.maxRateDescription = q.maxRateDescription;
        }
        if (q.type === "radiogroup" || q.type === "dropdown") {
            clean.choices = q.choices ?? [];
            if (q.defaultValue !== undefined) clean.defaultValue = q.defaultValue;
        }
        if (q.type === "radiogroup" && q.colCount)
            clean.colCount = q.colCount;
        if (q.type === "dropdown" && q.placeholder)
            clean.placeholder = q.placeholder;
        if (q.type === "comment") {
            clean.rows = q.rows ?? 4;
        }

        updateSchema((s) => {
            if (questionIdx === null) {
                s.pages[pageIdx].elements.push(clean);
            } else {
                s.pages[pageIdx].elements[questionIdx] = clean;
            }
        });
        setEditingQuestion(null);
    };

    const removeQuestion = (pageIdx: number, questionIdx: number) => {
        updateSchema((s) => {
            s.pages[pageIdx].elements.splice(questionIdx, 1);
        });
    };

    const moveQuestionUp = (pageIdx: number, questionIdx: number) => {
        if (questionIdx <= 0) return;
        updateSchema((s) => {
            const els = s.pages[pageIdx].elements;
            [els[questionIdx - 1], els[questionIdx]] = [
                els[questionIdx],
                els[questionIdx - 1],
            ];
        });
    };

    const moveQuestionDown = (pageIdx: number, questionIdx: number) => {
        if (!schema) return;
        const els = schema.pages[pageIdx].elements;
        if (questionIdx >= els.length - 1) return;
        updateSchema((s) => {
            const e = s.pages[pageIdx].elements;
            [e[questionIdx], e[questionIdx + 1]] = [
                e[questionIdx + 1],
                e[questionIdx],
            ];
        });
    };

    const togglePage = (idx: number) => {
        setExpandedPages((prev) => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    };

    // Count all questions
    const totalQuestions =
        schema?.pages.reduce((sum, p) => sum + p.elements.length, 0) ?? 0;

    // --- Render ---

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
                            toast.type === "success"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                        }`}
                    >
                        {toast.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Вопросы опроса
                    </h1>
                    <p className="text-slate-500">
                        Управление вопросами анкеты пациентов
                    </p>
                </div>
                {schema && (
                    <div className="flex items-center gap-3">
                        {hasChanges && (
                            <span className="text-sm text-amber-600 font-medium">
                                Есть несохранённые изменения
                            </span>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 text-white rounded-xl hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Сохранить
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {(["ru", "kz"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                            activeTab === tab
                                ? "bg-sky-500 text-white shadow-lg shadow-sky-200"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                        {tab === "ru" ? "Русский" : "Казахский"}
                        {configs[tab] && (
                            <span className="ml-2 text-xs opacity-70">
                                (v{configs[tab]!.version || "1.0"})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* No config — show Initialize button */}
            {!schema && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center"
                >
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">
                        Конфигурация не найдена
                    </h2>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                        Для языка «
                        {activeTab === "ru" ? "Русский" : "Казахский"}» ещё нет
                        конфигурации. Создайте новую, чтобы начать добавлять
                        вопросы.
                    </p>
                    <button
                        onClick={handleCreateEmpty}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl hover:from-sky-600 hover:to-teal-600 shadow-lg shadow-sky-200 transition-all"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Plus className="w-5 h-5" />
                        )}
                        Создать конфигурацию
                    </button>
                </motion.div>
            )}

            {/* Schema editor */}
            {schema && (
                <>
                    {/* Stats bar */}
                    <div className="flex gap-4 text-sm text-slate-500">
                        <span>
                            Страниц: <strong>{schema.pages.length}</strong>
                        </span>
                        <span>
                            Вопросов: <strong>{totalQuestions}</strong>
                        </span>
                    </div>

                    {/* Pages */}
                    <div className="space-y-4">
                        {schema.pages.map((page, pageIdx) => (
                            <motion.div
                                key={pageIdx}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                            >
                                {/* Page header */}
                                <div
                                    className="flex items-center gap-3 px-5 py-4 bg-slate-50 cursor-pointer select-none"
                                    onClick={() => togglePage(pageIdx)}
                                >
                                    <ChevronRight
                                        className={`w-5 h-5 text-slate-400 transition-transform ${
                                            expandedPages.has(pageIdx)
                                                ? "rotate-90"
                                                : ""
                                        }`}
                                    />
                                    <div className="flex-1">
                                        <span className="text-xs font-mono text-slate-400 mr-2">
                                            {page.name}
                                        </span>
                                        <span className="font-medium text-slate-800">
                                            {page.title || "(без заголовка)"}
                                        </span>
                                        <span className="ml-2 text-xs text-slate-400">
                                            ({page.elements.length} вопр.)
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => movePageUp(pageIdx)}
                                            disabled={pageIdx === 0}
                                            className="p-1.5 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                                            title="Вверх"
                                        >
                                            <ChevronUp className="w-4 h-4 text-slate-500" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                movePageDown(pageIdx)
                                            }
                                            disabled={
                                                pageIdx ===
                                                schema.pages.length - 1
                                            }
                                            className="p-1.5 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                                            title="Вниз"
                                        >
                                            <ChevronDown className="w-4 h-4 text-slate-500" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setEditingPage({
                                                    pageIdx,
                                                    name: page.name,
                                                    title: page.title || "",
                                                })
                                            }
                                            className="p-1.5 hover:bg-slate-200 rounded-lg"
                                            title="Редактировать"
                                        >
                                            <Edit3 className="w-4 h-4 text-slate-500" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                removePage(pageIdx)
                                            }
                                            className="p-1.5 hover:bg-red-100 rounded-lg"
                                            title="Удалить"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Questions */}
                                <AnimatePresence>
                                    {expandedPages.has(pageIdx) && (
                                        <motion.div
                                            initial={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{
                                                height: 0,
                                                opacity: 0,
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 py-3 space-y-2">
                                                {page.elements.length === 0 && (
                                                    <p className="text-sm text-slate-400 py-3 text-center">
                                                        Нет вопросов
                                                    </p>
                                                )}
                                                {page.elements.map(
                                                    (q, qIdx) => {
                                                        const Icon =
                                                            QUESTION_TYPE_ICONS[
                                                                q.type as QuestionType
                                                            ] ?? FileText;
                                                        return (
                                                            <div
                                                                key={qIdx}
                                                                className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl group hover:bg-sky-50 transition-colors"
                                                            >
                                                                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-medium text-slate-800 truncate">
                                                                            {
                                                                                q.title
                                                                            }
                                                                        </span>
                                                                        {q.isRequired && (
                                                                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                                                                *
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs text-slate-400">
                                                                        {
                                                                            q.name
                                                                        }{" "}
                                                                        ·{" "}
                                                                        {QUESTION_TYPE_LABELS[
                                                                            q.type as QuestionType
                                                                        ] ??
                                                                            q.type}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() =>
                                                                            moveQuestionUp(
                                                                                pageIdx,
                                                                                qIdx
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            qIdx ===
                                                                            0
                                                                        }
                                                                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                                                                    >
                                                                        <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            moveQuestionDown(
                                                                                pageIdx,
                                                                                qIdx
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            qIdx ===
                                                                            page
                                                                                .elements
                                                                                .length -
                                                                                1
                                                                        }
                                                                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-30"
                                                                    >
                                                                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            editQuestion(
                                                                                pageIdx,
                                                                                qIdx
                                                                            )
                                                                        }
                                                                        className="p-1 hover:bg-slate-200 rounded"
                                                                    >
                                                                        <Edit3 className="w-3.5 h-3.5 text-sky-500" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            removeQuestion(
                                                                                pageIdx,
                                                                                qIdx
                                                                            )
                                                                        }
                                                                        className="p-1 hover:bg-red-100 rounded"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}

                                                {/* Add question */}
                                                <button
                                                    onClick={() =>
                                                        addQuestion(pageIdx)
                                                    }
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-sky-500 hover:bg-sky-50 rounded-xl border border-dashed border-sky-200 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Добавить вопрос
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}

                        {/* Add page */}
                        <button
                            onClick={addPage}
                            className="w-full flex items-center justify-center gap-2 py-4 text-sm text-slate-500 hover:text-sky-500 hover:bg-sky-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-sky-300 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Добавить страницу
                        </button>
                    </div>
                </>
            )}

            {/* Question Edit Modal */}
            <AnimatePresence>
                {editingQuestion && (
                    <QuestionEditModal
                        question={editingQuestion.question}
                        onSave={saveQuestion}
                        onClose={() => setEditingQuestion(null)}
                    />
                )}
            </AnimatePresence>

            {/* Page Edit Modal */}
            <AnimatePresence>
                {editingPage && (
                    <PageEditModal
                        page={editingPage}
                        onSave={savePageEdit}
                        onClose={() => setEditingPage(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
