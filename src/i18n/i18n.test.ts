import { describe, it, expect, beforeAll } from 'vitest';
import { waitLocale, locale, isLoading, _ } from 'svelte-i18n';
import { get } from 'svelte/store';
import './index';

describe('i18n Initialization', () => {
    beforeAll(async () => {
        // Wait for locale to be ready
        await waitLocale();
    });

    it('should initialize locale without errors', async () => {
        await waitLocale();
        const currentLocale = get(locale);
        expect(currentLocale).toBeTruthy();
        expect(['en', 'pt']).toContain(currentLocale);
    });

    it('should not be loading after initialization', async () => {
        await waitLocale();
        const loading = get(isLoading);
        expect(loading).toBe(false);
    });

    it('should be able to translate keys', async () => {
        await waitLocale();
        const t = get(_);
        const translation = t('common.labels.level');
        expect(translation).toBeTruthy();
        expect(translation).not.toBe('common.labels.level');
    });

    it('should handle locale changes', async () => {
        await waitLocale();

        // Switch to PT
        locale.set('pt');
        await waitLocale();
        expect(get(locale)).toBe('pt');

        // Switch to EN
        locale.set('en');
        await waitLocale();
        expect(get(locale)).toBe('en');
    });
});
