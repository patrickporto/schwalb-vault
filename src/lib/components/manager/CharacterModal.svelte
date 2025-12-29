<script>
    export let isOpen = false;
    export let initialData = "{}"; // JSON string
    export let onClose;
    export let onSave;

    let form = { name: '', ancestry: '', novicePath: '', level: 1, defense: 10, health: 24 };
    
    $: if (isOpen && initialData) {
        try {
            const parsed = JSON.parse(initialData);
            form = {
                name: parsed.name || '',
                ancestry: parsed.ancestry || '',
                novicePath: (parsed.paths && parsed.paths.novice) ? parsed.paths.novice : '',
                level: parsed.level || 1,
                defense: parsed.defense || 10,
                health: parsed.health || (parsed.normalHealth) || 24
            };
        } catch(e) {
            // Error parsing or null
            form = { name: '', ancestry: '', novicePath: '', level: 1, defense: 10, health: 24 };
        }
    }
</script>

{#if isOpen}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" on:click|self={onClose}>
    <div class="bg-slate-800 rounded-xl w-full max-w-md p-6 border border-slate-700 shadow-2xl">
        <h3 class="font-bold text-white text-lg mb-4">Personagem</h3>
        <div class="space-y-3">
            <div>
                <label class="text-xs text-slate-500 uppercase font-bold block mb-1">Nome</label>
                <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-hidden focus:border-indigo-500" placeholder="Ex: Alaric" bind:value={form.name}/>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs text-slate-500 uppercase font-bold block mb-1">Ancestralidade</label>
                    <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-hidden focus:border-indigo-500" placeholder="Ex: Humano" bind:value={form.ancestry}/>
                </div>
                <div>
                    <label class="text-xs text-slate-500 uppercase font-bold block mb-1">Nível</label>
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-hidden focus:border-indigo-500" bind:value={form.level}/>
                </div>
            </div>
            <div>
                <label class="text-xs text-slate-500 uppercase font-bold block mb-1">Path Novice</label>
                <input class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-hidden focus:border-indigo-500" placeholder="Ex: Guerreiro, Mago" bind:value={form.novicePath}/>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="text-xs text-slate-500 uppercase font-bold block mb-1">Defesa</label>
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-hidden focus:border-indigo-500" bind:value={form.defense}/>
                </div>
                <div>
                    <label class="text-xs text-slate-500 uppercase font-bold block mb-1">Vida Máxima</label>
                    <input type="number" class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-hidden focus:border-indigo-500" bind:value={form.health}/>
                </div>
            </div>
        </div>
        <div class="flex gap-2 mt-6">
            <button on:click={onClose} class="flex-1 bg-slate-700 hover:bg-slate-600 transition-colors py-2 rounded text-white font-medium">Cancelar</button>
            <button on:click={() => onSave(form)} class="flex-1 bg-indigo-600 hover:bg-indigo-500 transition-colors py-2 rounded text-white font-bold">Salvar</button>
        </div>
    </div>
</div>
{/if}
