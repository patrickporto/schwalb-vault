<script lang="ts">
    import { t } from 'svelte-i18n';
    import { appSettings } from '$lib/stores/characterStore';
    import { X, Settings, History, Monitor, Smartphone, Palette } from 'lucide-svelte';
    import Toggle from '../common/Toggle.svelte';
    import { fly, fade } from 'svelte/transition';

    interface Props {
        isOpen: boolean;
        onClose: () => void;
    }

    let { isOpen = false, onClose }: Props = $props();

    function updateSetting(key: string, value: any) {
        appSettings.update(s => ({ ...s, [key]: value }));
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onclick={onClose}
        transition:fade={{ duration: 200 }}
    >
        <div
            class="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onclick={e => e.stopPropagation()}
            transition:fly={{ y: 20, duration: 300 }}
        >
            <!-- Header -->
            <div class="px-6 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Settings size={20} class="text-indigo-400" />
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-white uppercase tracking-tight">{$t('settings.title')}</h2>
                        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{$t('settings.description')}</p>
                    </div>
                </div>
                <button
                    onclick={onClose}
                    class="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all active:scale-95"
                >
                    <X size={24} />
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

                <!-- Section: Interface -->
                <div class="space-y-4">
                    <div class="flex items-center gap-2 mb-2 text-indigo-400">
                        <Monitor size={16} />
                        <h3 class="text-xs font-black uppercase tracking-widest">{$t('settings.sections.interface')}</h3>
                    </div>

                    <div class="space-y-6">
                        <Toggle
                            checked={$appSettings.autoOpenHistory}
                            onToggle={(val) => updateSetting('autoOpenHistory', val)}
                            label={$t('settings.options.auto_open_history.label')}
                            description={$t('settings.options.auto_open_history.description')}
                        />
                    </div>
                </div>

                <!-- Section: Appearance -->
                <div class="space-y-4">
                    <div class="flex items-center gap-2 mb-2 text-emerald-400">
                        <Palette size={16} />
                        <h3 class="text-xs font-black uppercase tracking-widest">{$t('settings.sections.appearance')}</h3>
                    </div>

                    <div class="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div class="flex justify-between items-center opacity-50 cursor-not-allowed">
                            <div class="flex flex-col">
                                <span class="text-sm font-black uppercase tracking-widest text-slate-400">{$t('settings.options.theme.label')}</span>
                                <span class="text-[10px] text-slate-500">{$t('settings.options.theme.description')}</span>
                            </div>
                            <div class="w-12 h-6 bg-slate-800 rounded-full border border-white/5 p-1 relative">
                                <div class="w-4 h-4 bg-slate-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Info footer -->
                <div class="pt-4 border-t border-white/5 flex flex-col items-center gap-4 text-center">
                    <p class="text-[10px] text-slate-500 leading-relaxed max-w-[250px]">
                        {$t('settings.sync_info')}
                    </p>
                </div>
            </div>

            <!-- Bottom Action -->
            <div class="p-4 bg-white/[0.02] border-t border-white/5">
                <button
                    onclick={onClose}
                    class="w-full bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest py-3 rounded-2xl transition-all active:scale-[0.98] text-sm"
                >
                    {$t('common.buttons.close')}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
    }
</style>
