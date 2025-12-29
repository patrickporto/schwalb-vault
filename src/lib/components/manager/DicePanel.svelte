<script>
    import { isHistoryOpen } from '$lib/stores/characterStore';
    import { Dices } from 'lucide-svelte';
    import { characterActions } from '$lib/stores/characterStore';

    // Same dice logic as SessionView or extract it
    function rollDice(sides, count = 1) {
        const results = [];
        let total = 0;
        for(let i=0; i<count; i++) {
            const r = Math.floor(Math.random() * sides) + 1;
            results.push(r);
            total += r;
        }
        
        characterActions.addToHistory({
            source: 'GM',
            name: `${count}d${sides}`,
            description: count > 1 ? `Resultados: [${results.join(', ')}]` : null,
            total,
            formula: `${count}d${sides}`,
            crit: sides === 20 && results.includes(20)
        });
        isHistoryOpen.set(true); // Auto-open sidebar
    }
</script>

<div class="bg-slate-900 border border-slate-800 rounded-xl p-4 sticky top-4">
    <h3 class="font-bold text-slate-400 text-sm mb-3 flex items-center gap-2"><Dices size={14}/> Rolagens Rápidas</h3>
    <div class="grid grid-cols-2 gap-2">
        <button on:click={() => rollDice(20)} class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-1 transition-colors"><Dices size={16}/> d20</button>
        <button on:click={() => rollDice(6)} class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-1 transition-colors"><Dices size={16}/> d6</button>
        <button on:click={() => rollDice(6, 2)} class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-1 text-xs transition-colors">2d6</button>
        <button on:click={() => rollDice(6, 3)} class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded flex items-center justify-center gap-1 text-xs transition-colors">3d6</button>
    </div>
    <p class="text-[10px] text-slate-500 mt-2 text-center">Abrir histórico para ver detalhes.</p>
</div>
