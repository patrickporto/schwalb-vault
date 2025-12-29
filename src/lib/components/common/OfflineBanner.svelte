<script lang="ts">
    import { WifiOff } from 'lucide-svelte';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    let isOnline = $state(true);

    function updateOnlineStatus() {
        isOnline = navigator.onLine;
    }

    onMount(() => {
        isOnline = navigator.onLine;
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    });
</script>

{#if !isOnline}
    <div 
        class="bg-red-900/90 text-red-100 text-xs font-bold uppercase tracking-widest py-2 text-center fixed top-0 left-0 w-full z-[200] backdrop-blur-sm border-b border-red-500/30 flex items-center justify-center gap-2"
        transition:fly={{ y: -50, duration: 300 }}
    >
        <WifiOff size={14} />
        Você está offline
    </div>
{/if}
