import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/ecommerce-admin/locale/{{lng}}/{{ns}}.json',
        },
        ns: ['sidebar', 'product', 'pagination',
            'common', 'color', 'size', 'delete',
            'profile', 'login', 'category', 'setting', 'user', 'order', 'blog', 'message',
            'statistics'
        ],
        defaultNS: 'sidebar',
        load: 'languageOnly'
    });

export default i18n;