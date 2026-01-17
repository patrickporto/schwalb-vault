<script lang="ts">
    import { t } from 'svelte-i18n';
    import { X, Swords, Clock, ZoomIn, ZoomOut, RotateCcw } from 'lucide-svelte';
    import Modal from '$lib/components/common/Modal.svelte';
    import CombatViewerCard from './CombatViewerCard.svelte';
    import { sortCombatants } from '$lib/logic/initiative';
    import type { InitiativeStyle } from '$lib/systems';

    interface Props {
        isOpen: boolean;
        campaign: any;
        onClose: () => void;
    }

    let { isOpen = false, campaign, onClose }: Props = $props();

    let zoomLevel = $state(1);
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 2;
    const ZOOM_STEP = 0.1;

    function zoomIn() {
        if (zoomLevel < MAX_ZOOM) {
            zoomLevel = Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM);
        }
    }

    function zoomOut() {
        if (zoomLevel > MIN_ZOOM) {
            zoomLevel = Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM);
        }
    }

    function resetZoom() {
        zoomLevel = 1;
    }

    // Combat state from campaign
    let combat = $derived(campaign?.combat || { active: false, round: 1 });
    let activeEnemies = $derived(campaign?.activeEnemies || []);
    let roster = $derived(campaign?.sessionRoster || []);
    let members = $derived(campaign?.members || []);
    let currentStyle = $derived<InitiativeStyle>(campaign?.initiativeStyle || 'dle');
    let healthDisplayMode = $derived<'bar' | 'estimate'>(campaign?.healthDisplayMode || 'bar');

    // Build players list from members in roster
    let players = $derived(members.filter(m => roster.includes(m.id) && (!m.campaignApproval || m.campaignApproval === 'approved')).map(m => ({ ...m, type: 'player' })));

    // Sorted combatants
    let sortedCombatants = $derived(sortCombatants(currentStyle, players, activeEnemies));
</script>

<Modal {isOpen} {onClose} title={$t('session.combat_viewer.title')} maxWidth="max-w-lg">
    <!-- Zoom Controls -->
    <div class="flex items-center justify-end gap-2 mb-4">
        <button
            on:click={zoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out"
        >
            <ZoomOut size={18} class="text-slate-300" />
        </button>
        <div class="px-3 py-1 rounded-lg bg-slate-800 text-sm font-mono text-slate-300 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
        </div>
        <button
            on:click={zoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom In"
        >
            <ZoomIn size={18} class="text-slate-300" />
        </button>
        <button
            on:click={resetZoom}
            disabled={zoomLevel === 1}
            class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Reset Zoom"
        >
            <RotateCcw size={18} class="text-slate-300" />
        </button>
    </div>

    <!-- Zoomable Content Area -->
    <div style="transform: scale({zoomLevel}); transform-origin: top center;">
        {#if combat.active}
            <!-- Round Counter -->
            <div class="flex items-center justify-center gap-3 mb-4 py-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <Clock size={18} class="text-indigo-400" />
                <div class="text-center">
                    <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{$t('session.combat.round')}</div>
                    <div class="text-2xl font-mono font-bold text-white leading-none">{combat.round}</div>
                </div>
            </div>

            <!-- Combatants List -->
            <div class="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                {#each sortedCombatants as entity (entity.type === 'player' ? entity.id : entity.instanceId)}
                    <CombatViewerCard {entity} {healthDisplayMode} />
                {/each}
                {#if sortedCombatants.length === 0}
                    <div class="text-center text-slate-500 italic py-8">{$t('session.combat.empty')}</div>
                {/if}
            </div>
        {:else}
            <div class="text-center py-12">
                <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <Swords size={32} />
                </div>
                <p class="text-slate-400 font-bold">{$t('session.combat_viewer.no_combat')}</p>
            </div>
        {/if}
    </div>
</Modal>
