<script lang="ts">
    import { subscribeToImage } from '$lib/logic/image';
    import { onDestroy } from 'svelte';

    let { hash, alt, size = "md", fallbackText = "?" } = $props<{
        hash?: string;
        alt: string;
        size?: "sm" | "md" | "lg" | "xl" | "custom";
        fallbackText?: string;
    }>();

    let imageData = $state<string | undefined>(undefined);
    let unsubscribe: () => void;

    $effect(() => {
        if (unsubscribe) unsubscribe();
        if (hash) {
            unsubscribe = subscribeToImage(hash, (data) => {
                imageData = data;
            });
        } else {
            imageData = undefined;
        }
    });

    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-16 h-16 text-lg",
        xl: "w-20 h-20 text-xl",
        custom: "w-full h-full"
    };
</script>

<div class="{sizeClasses[size]} relative flex-shrink-0">
    {#if imageData}
        <img src={imageData} {alt} class="w-full h-full object-cover rounded-full border border-white/10 shadow-sm" />
    {:else}
        <div class="w-full h-full bg-slate-800 rounded-full border border-white/10 flex items-center justify-center font-black text-slate-500 shadow-sm">
            {fallbackText}
        </div>
    {/if}
</div>
