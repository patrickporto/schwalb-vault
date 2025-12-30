import { waitLocale } from 'svelte-i18n';
import '../i18n';

export const prerender = false;
export const ssr = false;

export const trailingSlash = "always";

export async function load() {
    await waitLocale();
    return {};
}
