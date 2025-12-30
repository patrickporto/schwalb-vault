import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./en.json'));
register('pt', () => import('./pt.json'));

const fallback = 'en';
let initialLocale = fallback;

if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_locale');
    initialLocale = stored || getLocaleFromNavigator() || fallback;
}

init({
    fallbackLocale: fallback,
    initialLocale,
});
