module.exports = {
    ext: {
        name: 'Клиент для Яндекс.Почта',
        description: 'Удобный клиент для Яндекс.Почта',
    },
    notification: {
        unread: {
            title: 'У вас есть непрочитанные письма',
            message: 'Непрочитанных писем: $1',
        },
        notAuth: {
            title: 'Вы не авторизованы',
            message: 'Пожалуйста, войдите в свой Яндекс аккаунт',
        },
    },
    popup: {
        title: 'Яндекс.Почта',
        compose: 'Написать',
        actions: {
            open: 'Открыть',
            read: 'Прочитано',
            spam: 'Спам',
            remove: 'Удалить',
        },
        emptyList: 'У вас нет непрочитанных писем',
        loadingError: 'Не удалось загрузить письма... Попробуйте позже',
        unavailable: {
            title: 'Что-то пошло не так...',
            subTitle: 'Возможны следующие причины почему расширение может работать не корректно:',
            notAuth: {
                label: 'Вы не авторизованы.',
                checkAuth: 'Проверьте, что вы авторизованы в Яндекс (именно <strong>.$1</strong> домен). Также вы можете выбрать другой домен в настройках расширения.',
                relogin: 'Попробуйте разлогиниться и залогиниться снова.',
            },
            noConnection: {
                label: 'Отсутствует соединение с интернетом.',
            },
            nothingHelped: 'Если ничего из вышеперечисленного не помогло, попробуйте перезагрузить расширение.',
            reloadBtn: 'Перезагрузить расширение',
        },
        donation: {
            text: 'Хотите новых настроек, функций и просто стабильной работы расширения?',
            donateBtn: 'Поддержите проект!',
        },
        months: [
            'Января',
            'Февраля',
            'Марта',
            'Апреля',
            'Мая',
            'Июня',
            'Июля',
            'Августа',
            'Сентября',
            'Октября',
            'Ноября',
            'Декабря',
        ],
    },
    settings: {
        newMessageNotification: {
            label: 'Показывать уведомление при получении нового письма',
            options: [
                'отключено',
                'только текстовое',
                'текстовое и звуковое',
            ],
        },
        unreadMessagesNotification: {
            label: 'Показывать текстовое уведомление при наличие непрочитанных писем',
            options: [
                'отключено',
                'каждые 5 мин',
                'каждые 15 мин',
                'каждые 30 мин',
            ],
        },
        unreadMessagesSound: {
            label: 'Проигрывать звуковое уведомление при наличие непрочитанных писем',
            description: 'В соответствие с интервалом выбраным выше',
        },
        notAuthNotification: {
            label: 'Показывать уведомления если вы не авторизованы',
            description: 'Каждые 5 мин',
            options: [
                'отключено',
                'только текстовое',
                'текстовое и звуковое',
            ],
        },
        setShortcuts: {
            label: 'Быстрые клавиши',
            linkText: 'редактировать',
        },
        preferredDomain: {
            label: 'Предпочитаемый домен',
            description: 'Будет использован для авторизиции, ссылок и т.д.',
            options: [
                'ru',
                'ua',
                'by',
                'kz',
                'com',
                'com.tr',
            ],
        },
    },
};
