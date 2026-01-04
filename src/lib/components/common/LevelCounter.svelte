<script lang="ts">
    import { Plus, Minus } from 'lucide-svelte';
    import { t } from 'svelte-i18n';

    interface Props {
        value: number;
        label?: string;
        onUpdate: (newValue: number) => void;
        min?: number;
        max?: number;
    }

    let { value, label, onUpdate, min = 0, max = 20 }: Props = $props();

    function decrease() {
        if (value > min) {
            onUpdate(value - 1);
        }
    }

    function increase() {
        if (value < max) {
            onUpdate(value + 1);
        }
    }
</script>

<div>
    {#if label}
        <span class="text-[10px] text-indigo-300 uppercase font-bold mb-2 block">{label}</span>
    {/if}
    <div class="flex items-center justify-between bg-black/40 rounded-xl p-1.5 border border-white/5">
        <button
            type="button"
            onclick={decrease}
            class="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={value <= min}
            aria-label={$t('common.buttons.decrease')}
        >
            <Minus size={18}/>
        </button>
        <div class="flex flex-col items-center min-w-[3rem]">
            <span class="text-2xl font-black text-white leading-none tracking-tighter">{value}</span>
        </div>
        <button
            type="button"
            onclick={increase}
            class="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all active:scale-90 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={value >= max}
            aria-label={$t('common.buttons.increase')}
        >
            <Plus size={18}/>
        </button>
    </div>
</div>
