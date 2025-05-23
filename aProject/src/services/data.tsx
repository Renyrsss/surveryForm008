export const surveyJsonRu = {
    showProgressBar: true,
    progressBarLocation: "top",
    pageNextText: "Далее",
    pagePrevText: "Назад",
    completeText: "Отправить",
    clearText: "exit",

    pages: [
        {
            // title: "count of pages",

            elements: [
                {
                    type: "dropdown",
                    name: "отдел",
                    title: "Выберите отдел",
                    isRequired: true,
                    showNoneItem: true,
                    showOtherItem: true,
                    placeholder: " отдел",
                    choices: [
                        "КХО",
                        "ИК-1",
                        "ИК-2",
                        "Гинекология",
                        "Аритмология",
                        "Терапия 2 ",
                        "ОХ и ТХ",
                        "НХО",
                        "Урология",
                        "ДКХО",
                    ],
                },
                {
                    type: "radiogroup",
                    name: "пол",
                    title: "Выберите ваш пол",
                    isRequired: true,

                    colCount: 2,
                    choices: ["Мужской", "Женский"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "возраст",
                    title: "Выберите ваш возраст",
                    isRequired: true,

                    colCount: 3,
                    choices: [
                        "меньше 15",
                        "от 16 - до 30",
                        "от 31 - до 40",
                        "от 41 - до 50",
                        "от 51 - до 60",
                        "больше 60",
                    ],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "panel",
                    name: "Насколько Вы удовлетворены оперативностью обслуживания",
                    elements: [
                        {
                            type: "rating",
                            name: "Регистратура",
                            title: "Регистратуры",
                            isRequired: true,
                            autoGenerate: false,
                            rateCount: 10,
                            rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        },
                        {
                            type: "rating",
                            name: "Лечебный отдел",
                            title: "Лечебного отдела",
                            isRequired: true,
                            autoGenerate: false,
                            rateCount: 10,
                            rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        },
                        {
                            type: "rating",
                            name: "Приемный отдел",
                            title: "Приемного отдела",
                            isRequired: true,
                            autoGenerate: false,
                            rateCount: 10,
                            rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        },
                        {
                            type: "rating",
                            name: "Диагностический отдел",
                            title: "Диагностических отделов",
                            isRequired: true,
                            autoGenerate: false,
                            rateCount: 10,
                            rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        },
                    ],

                    questionTitleLocation: "top",
                    title: "Насколько Вы удовлетворены оперативностью обслуживания",
                },
            ],
        },
        {
            title: "Оцените качество работы в отделе , где вы получаете обследование и лечение ",
            elements: [
                {
                    type: "rating",
                    name: "Лечащего врача",
                    title: "Лечащего врача",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Дежурного врача",
                    title: "Дежурного врача ",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Медицинской сестры",
                    title: "Медицинской сестры ",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Младшего мед персонала",
                    title: "Младшего мед персонала",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Персонала диагностических отделов",
                    title: "Персонала диагностических отделов",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Персонала реанимационных отделов",
                    title: "Персонала реанимационных отделов",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Персонала отдела восстановительного лечения",
                    title: "Персонала отдела восстановительного лечения",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
            ],
        },
        {
            title: "Удовлетворены ли Вы вежливостью и внимательностью",
            elements: [
                {
                    type: "rating",
                    name: "Удовлетворены ли Вы вежливостью и внимательностью Врача",
                    title: "Удовлетворены ли Вы вежливостью и внимательностью Врача",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Удовлетворены ли Вы вежливостью и внимательностью Медсестры",
                    title: "Удовлетворены ли Вы вежливостью и внимательностью Медсестры",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Насколько Вы удовлетворены полнотой информирования перед операцией, манипуляциями, процедурами",
                    title: "Насколько Вы удовлетворены полнотой информирования перед операцией, манипуляциями, процедурами",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Оцените качество и полноту рекомендации врача при выписке",
                    title: "Оцените качество и полноту рекомендации врача при выписке",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Оцените качество питания",
                    title: "Оцените качество питания",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Оцените внешний вид персонала",
                    title: "Оцените внешний вид персонала",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Оцените сервисные услуги (чистота палаты, киоск, парковка, охрана)",
                    title: "Оцените сервисные услуги (чистота палаты, киоск, парковка, охрана)",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
            ],
        },
        {
            elements: [
                {
                    type: "rating",
                    name: "Оцените , насколько Вы готовы рекомендовать нашу клинику",
                    title: "Оцените , насколько Вы готовы рекомендовать нашу клинику",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Оцените , насколько Вы готовы рекомендовать нашу клинику вашим друзьям и знакомым",
                    title: "Оцените , насколько Вы готовы рекомендовать нашу клинику вашим друзьям и знакомым",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Оцените, насколько Вы предпочли бы повторно обратиться в нашу клинику при необходимости обследования и лечения",
                    title: "Оцените, насколько Вы предпочли бы повторно обратиться в нашу клинику при необходимости обследования и лечения",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Насколько Вы удовлетворены в целом клиникой?",
                    title: "Насколько Вы удовлетворены в целом клиникой?",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Как Вы оцениваете удобство ориентировки по указателям в учреждении",
                    title: "Как Вы оцениваете удобство ориентировки по указателям в учреждении",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Как Вы оцениваете своевременность выполнения медперсоналом назначеных процедур",
                    title: "Как Вы оцениваете своевременность выполнения медперсоналом назначеных процедур",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Как Вы оцениваете соблюдение правил безопасности для Вашего здоровья при проведении процедур",
                    title: "Как Вы оцениваете соблюдение правил безопасности для Вашего здоровья при проведении процедур",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                // {
                //     type: "rating",
                //     name: "Была ли предоставлена Вам возможность свободного выбора врача",
                //     title: "Была ли предоставлена Вам возможность свободного выбора врача",
                //     isRequired: true,
                //     autoGenerate: false,
                //     rateCount: 10,
                //     rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                // },
                {
                    type: "rating",
                    name: "Как Вы оцениваете наличие информационных / образовательных пособий для пациентов",
                    title: "Как Вы оцениваете наличие информационных / образовательных пособий для пациентов",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
                {
                    type: "rating",
                    name: "Как Вы оцениваете качество лечения в стационаре",
                    title: "Как Вы оцениваете качество лечения в стационаре",
                    isRequired: true,
                    autoGenerate: false,
                    rateCount: 10,
                    rateValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },
            ],
        },

        {
            elements: [
                {
                    type: "radiogroup",
                    name: "свободного выбора врача",
                    title: "Была ли предоставлена Вам возможность свободного выбора врача",
                    isRequired: true,

                    colCount: 3,
                    choices: ["Да", "Нет", "Затрудняюсь ответить"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "во время осмотра / процедура",
                    title: "Соблюдается ли конфиденциальность во время осмотра / процедура ",
                    isRequired: true,

                    colCount: 3,
                    choices: ["Да", "Нет", "Затрудняюсь ответить"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "началом лечения",
                    title: "Было ли получено от Вас согласие перед исследованием или началом лечения ",
                    isRequired: true,

                    colCount: 3,
                    choices: ["Да", "Нет", "Затрудняюсь ответить"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "Вашим осмотром , манипуляцией , контактом ?",
                    title: "Мыл ли медицинский работник руки перед Вашим осмотром , манипуляцией , контактом ? ",
                    isRequired: true,

                    colCount: 3,
                    choices: ["Да", "Нет", "Затрудняюсь ответить"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "Приходилось ли Вам приобретать недостающие для лечения лекарственные препараты за счет собсвенных средств ( при лечении по квоте ) ",
                    title: "Приходилось ли Вам приобретать недостающие для лечения лекарственные препараты за счет собсвенных средств ( при лечении по квоте ) ",
                    isRequired: true,

                    colCount: 3,
                    choices: ["Да", "Нет", "Затрудняюсь ответить"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "Приходилось ли Вам осуществлять оплату медицинские услуги непосредственно медперсоналу, минуя кассу, если да (ФИО сотрудника)",
                    title: "Приходилось ли Вам осуществлять оплату медицинские услуги непосредственно медперсоналу, минуя кассу, если да (ФИО сотрудника)",
                    isRequired: true,

                    colCount: 3,
                    choices: ["Да", "Нет", "Затрудняюсь ответить"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "Была ли предоставлена информация об альтернативных методах лечения?",
                    title: "Была ли предоставлена информация об альтернативных методах лечения?",
                    isRequired: true,

                    colCount: 3,
                    choices: ["Да", "Нет", "Затрудняюсь ответить"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "Работала ли в палате кнопка вызова?",
                    title: "Работала ли в палате кнопка вызова?",
                    isRequired: true,

                    colCount: 3,
                    choices: ["Да", "Нет", "Затрудняюсь ответить"],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
            ],
        },
        {
            elements: [
                {
                    type: "radiogroup",
                    name: "Длительность ожидания в приемном покое при госпитализации (укажите какие)",
                    title: "Длительность ожидания в приемном покое при госпитализации (укажите какие)",
                    isRequired: true,

                    colCount: 3,
                    choices: [
                        "Меньше 15 мин",
                        "15-30 мин",
                        "30-45 мин",
                        "45 мин - 1 час",
                        "1 час и больше",
                    ],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    type: "radiogroup",
                    name: "Медицинское обслуживание в этом Центре (подчеркните нужное)",
                    title: " Медицинское обслуживание в этом Центре (подчеркните нужное)",
                    isRequired: true,

                    colCount: 1,
                    choices: [
                        "Лучше, чем в других медицинских организациях",
                        "Такое же, как и в других медицинских организациях",
                        "Хуже, чем в других медицинских организациях",
                        "Не знаю",
                        "1 час и больше",
                    ],
                    separateSpecialChoices: true,
                    allowClear: true,
                },
                {
                    name: "Ваши замечания, пожелания, предложения",
                    title: "Укажите Ваши замечания, пожелания, предложения по организации работы больницы и повышению качества оказания медицинской помощи:",
                    type: "comment",
                },
            ],
        },
    ],
};
