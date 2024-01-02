import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'
import ca from './ca'
import en from './en'
import es from './es'
import store from '../store'

export const languageResources = {
    en: { translation: en },
    cat: { translation: ca },
    es: { translation: es },
};

const initialLanguage = store.getters.user.user.language;



i18next
  .init({
    debug: true,
    fallbackLng: 'cat',
    lng: initialLanguage,
    resources: languageResources,
  });

export default function (app) {
  app.use(I18NextVue, { i18next })
  return app
}
