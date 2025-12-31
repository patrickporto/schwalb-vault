<script lang="ts">
    import { t } from 'svelte-i18n';
    import { modalState } from '$lib/stores/characterStore';
    import { Clover } from 'lucide-svelte';

    import AttributesSectionSotDL from './AttributesSectionSotDL.svelte';
    import VitalsSectionSotDL from './VitalsSectionSotDL.svelte';
    import AfflictionsSectionSotDL from './AfflictionsSectionSotDL.svelte';
    import SensesSectionSotDL from './SensesSectionSotDL.svelte';
    import CampaignStatusSotDL from './CampaignStatusSotDL.svelte';
</script>

<div class="space-y-4 flex-1 flex flex-col">
    <AttributesSectionSotDL />

    <button
        onclick={() => modalState.set({type: 'pre_roll', isOpen: true, data: {type:'luck', system: 'sofdl', source: {name: $t('character.luck_test')}}})}
        class="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-center gap-3 group transition-all shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
    >
        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clover size={24} class="text-white"/>
        </div>
        <span class="font-black text-white uppercase tracking-wider text-sm">{$t('character.luck_test')}</span>
    </button>

    <VitalsSectionSotDL />
    <SensesSectionSotDL />
    <AfflictionsSectionSotDL />

    <div class="lg:hidden mt-auto pt-6">
        <CampaignStatusSotDL banner />
    </div>
</div>
