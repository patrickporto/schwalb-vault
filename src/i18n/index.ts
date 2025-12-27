import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./en.json'));

const fallback = 'en';
const initialLocale = typeof window !== 'undefined'
    ? getLocaleFromNavigator()
    : fallback;

init({
    fallbackLocale: fallback,
    initialLocale,
});
