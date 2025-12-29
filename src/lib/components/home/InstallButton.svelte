<script lang="ts">
    import { Download } from 'lucide-svelte';
    import { onMount } from 'svelte';

    let deferredPrompt: any = $state(null);
    let isVisible = $state(false);

    onMount(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            isVisible = true;
        });

        window.addEventListener('appinstalled', () => {
            deferredPrompt = null;
            isVisible = false;
        });
    });

    async function installPWA() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            deferredPrompt = null;
            isVisible = false;
        }
    }
</script>

{#if isVisible}
    <button 
        onclick={installPWA}
        class="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl shadow-indigo-900/50 flex items-center gap-2 font-bold animate-pulse hover:animate-none transition-all active:scale-95"
    >
        <Download size={24} />
        <span class="text-sm uppercase tracking-wider hidden sm:inline">Instalar App</span>
    </button>
{/if}
