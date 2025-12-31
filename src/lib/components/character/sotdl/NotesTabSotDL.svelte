<script lang="ts">
    import { t } from 'svelte-i18n';
    import { sotdlCharacter } from '$lib/stores/characterStoreSotDL';
    import RichTextEditor from '$lib/components/common/RichTextEditor.svelte';
    import LanguagesSectionSotDL from './LanguagesSectionSotDL.svelte';
    import ProfessionsSectionSotDL from './ProfessionsSectionSotDL.svelte';
</script>

<div class="space-y-6">
    <!-- Mobile Only Sections (shown in sidebar on desktop) -->
    <div class="md:hidden space-y-4">
        <LanguagesSectionSotDL />
        <ProfessionsSectionSotDL />
    </div>

    <div class="space-y-4">
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest">{$t('character.notes.title')}</h3>
            <span class="text-[10px] text-slate-600 italic">{$t('character.notes.autosave')}</span>
        </div>
        <RichTextEditor
            bind:value={$sotdlCharacter.notes}
            placeholder={$t('character.notes.placeholder')}
        />
    </div>
</div>
