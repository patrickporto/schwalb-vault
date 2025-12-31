<script lang="ts">
    interface Props {
        checked: boolean;
        onToggle: (checked: boolean) => void;
        label?: string;
        description?: string;
        disabled?: boolean;
    }

    let { checked = false, onToggle, label = "", description = "", disabled = false }: Props = $props();

    function handleToggle() {
        if (disabled) return;
        onToggle(!checked);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="flex items-center justify-between gap-4 p-1 group {disabled ? 'opacity-50 grayscale' : 'cursor-pointer'}"
    onclick={handleToggle}
>
    {#if label || description}
        <div class="flex flex-col">
            <span class="text-sm font-black uppercase tracking-widest transition-colors {checked ? 'text-indigo-400' : 'text-slate-300 group-hover:text-white'}">
                {label}
            </span>
            {#if description}
                <span class="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                    {description}
                </span>
            {/if}
        </div>
    {/if}

    <div
        class="relative w-12 h-6 rounded-full transition-all duration-300 ease-in-out {checked ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800 border border-white/5'}"
    >
        <div
            class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-md {checked ? 'translate-x-6' : 'translate-x-0'}"
        >
            {#if checked}
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                </div>
            {/if}
        </div>
    </div>
</div>
