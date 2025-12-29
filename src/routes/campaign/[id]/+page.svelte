<script>
    import { page } from '$app/stores';
    import { campaignsMap, waitForSync } from '$lib/db';
    import { liveCampaigns } from '$lib/stores/live';
    import { ChevronLeft } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import SessionView from '$lib/components/manager/SessionView.svelte';
    import BestiaryView from '$lib/components/manager/BestiaryView.svelte';
    import HistorySidebar from '$lib/components/character/HistorySidebar.svelte';
    import { isHistoryOpen } from '$lib/stores/characterStore';
    
    let id;
    let campaign = null;
    let activeSubTab = 'session'; 

    $: id = $page.params.id;
    $: campaign = $liveCampaigns.find(c => c.id === id);
    $: loaded = !!campaign; // Simple loaded check based on if campaign exists
</script>


<div class="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 pb-20">
    <div class="max-w-7xl mx-auto">
        {#if loaded && campaign}
            <div class="animate-in slide-in-from-right-4">
                <button on:click={() => goto('/')} class="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors font-bold text-sm"><ChevronLeft size={16}/> Voltar</button>

                <div class="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                    <h1 class="text-2xl font-bold text-white">{campaign.name}</h1>
                    <div class="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button on:click={() => activeSubTab = 'session'} class="px-4 py-1.5 rounded text-sm font-bold transition-all {activeSubTab === 'session' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}">Sessão</button>
                        <button on:click={() => activeSubTab = 'bestiary'} class="px-4 py-1.5 rounded text-sm font-bold transition-all {activeSubTab === 'bestiary' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}">Bestiário</button>
                    </div>
                </div>

                {#if activeSubTab === 'session'}
                    <SessionView {campaign} />
                {:else if activeSubTab === 'bestiary'}
                    <BestiaryView />
                {/if}
            </div>
        {:else if loaded && !campaign}
            <div class="text-center text-red-500 mt-10">Campanha não encontrada.</div>
        {:else}
            <div class="flex items-center justify-center min-h-[50vh]">
                 <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        {/if}
    </div>
    
    <HistorySidebar isOpen={$isHistoryOpen} onClose={() => isHistoryOpen.set(false)} />
</div>
