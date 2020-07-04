const NextI18Next = require('next-i18next').default;

module.exports = new NextI18Next({
    defaultLanguage: 'fa',
    otherLanguages: ['en'],
    defaultNS: 'translation',
    // localePath: 'public/locales',
    localeSubpaths: {
        fa: 'fa',
        en: 'en'
    }
});
