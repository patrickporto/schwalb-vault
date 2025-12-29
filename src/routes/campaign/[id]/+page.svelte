<script>
    import { page } from '$app/stores';
    import { campaignsMap, waitForSync } from '$lib/db';
    import { liveCampaigns } from '$lib/stores/live';
    import SessionView from '$lib/components/manager/SessionView.svelte';
    import BestiaryView from '$lib/components/manager/BestiaryView.svelte';
    import CampaignHeader from '$lib/components/manager/CampaignHeader.svelte';
    import HistorySidebar from '$lib/components/character/HistorySidebar.svelte';
    import { isHistoryOpen } from '$lib/stores/characterStore';
    
    let id;
    let campaign = null;
    let activeSubTab = 'session'; 

    $: id = $page.params.id;
    $: campaign = $liveCampaigns.find(c => c.id === id);
    $: loaded = !!campaign;
</script>


<div class="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
    {#if loaded && campaign}
        <CampaignHeader 
            campaignName={campaign.name} 
            {activeSubTab} 
            onTabChange={(tab) => activeSubTab = tab} 
        />

        <main class="max-w-7xl mx-auto p-4 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
            {#if activeSubTab === 'session'}
                <SessionView {campaign} />
            {:else if activeSubTab === 'bestiary'}
                <BestiaryView />
            {/if}
        </main>
    {:else if loaded && !campaign}
        <div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 class="text-xl font-bold mb-2">Campanha não encontrada</h2>
            <p class="text-slate-400 mb-6">Esta campanha pode ter sido removida ou o link está incorreto.</p>
            <button on:click={() => window.history.back()} class="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold transition-all">
                Voltar
            </button>
        </div>
    {:else}
        <div class="flex items-center justify-center min-h-screen">
             <div class="relative w-16 h-16">
                 <div class="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                 <div class="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
        </div>
    {/if}
    
    <HistorySidebar isOpen={$isHistoryOpen} onClose={() => isHistoryOpen.set(false)} />
</div>

