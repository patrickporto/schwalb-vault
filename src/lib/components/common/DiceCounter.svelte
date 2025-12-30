<script lang="ts">
    import { Plus, Minus } from 'lucide-svelte';

    interface Props {
        value: number;
        label?: string;
        onUpdate: (newValue: number) => void;
        min?: number;
    }

    let { value, label, onUpdate, min = 0 }: Props = $props();

    function decrease() {
        const newValue = Math.max(min, value - 1);
        onUpdate(newValue);
    }

    function increase() {
        const newValue = value + 1;
        onUpdate(newValue);
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
            class="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all active:scale-90" 
            aria-label="Diminuir"
        >
            <Minus size={18}/>
        </button>
        <div class="flex flex-col items-center">
            <span class="text-2xl font-black text-white leading-none tracking-tighter">{value}d6</span>
        </div>
        <button 
            type="button"
            onclick={increase}
            class="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all active:scale-90 shadow-lg shadow-indigo-500/20" 
            aria-label="Aumentar"
        >
            <Plus size={18}/>
        </button>
    </div>
</div>
