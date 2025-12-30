<script lang="ts">
    import { scale } from 'svelte/transition';

    interface Props {
        text?: string;
        children?: import('svelte').Snippet;
        class?: string;
    }

    let { text = '', children, class: className = '' }: Props = $props();
    let visible = $state(false);
    let isTouch = false;

    // Position adjustment
    let xOffset = $state(0);
    let container: HTMLDivElement;
    let tooltipEl: HTMLDivElement | undefined = $state();

    function updatePosition() {
        if (!container || !tooltipEl) return;
        const triggerRect = container.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        const halfWidth = tooltipRect.width / 2;

        // Reset
        xOffset = 0;

        // Check left edge of screen
        const leftEdge = triggerRect.left + (triggerRect.width / 2) - halfWidth;
        if (leftEdge < 10) {
            xOffset = 10 - leftEdge;
        }

        // Check right edge of screen
        const rightEdge = triggerRect.left + (triggerRect.width / 2) + halfWidth;
        if (rightEdge > window.innerWidth - 10) {
            xOffset = (window.innerWidth - 10) - rightEdge;
        }
    }

    async function show() {
        if (isTouch) return;
        visible = true;
        // Wait for render to get true width
        setTimeout(updatePosition, 0);
    }

    function toggle(e: MouseEvent) {
        if (isTouch) {
            if (!visible) {
                 visible = true;
                 setTimeout(updatePosition, 0);
            } else {
                 visible = false;
            }
        }
    }
</script>

<div
    bind:this={container}
    class="relative inline-flex {className}"
    role="button"
    onmouseenter={show}
    onmouseleave={() => !isTouch && (visible = false)}
    ontouchstart={() => isTouch = true}
    onclick={toggle}
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') visible = !visible; }}
    tabindex="0"
    style="--x-offset: {xOffset}px;"
>
    {@render children?.()}

    {#if visible && text}
        <div
            bind:this={tooltipEl}
            transition:scale={{duration: 150, start: 0.95}}
            class="absolute z-50 bottom-full left-1/2 mb-2 w-max max-w-[200px] p-2 bg-slate-800 border border-indigo-500 rounded-lg shadow-xl shadow-black/50 text-[10px] text-slate-300 leading-relaxed text-center pointer-events-none whitespace-normal -translate-x-1/2"
            style="margin-left: var(--x-offset);"
        >
             {text}
             <!-- Arrow -->
             <div
                class="absolute -bottom-1 left-1/2 w-2 h-2 bg-slate-800 border-r border-b border-indigo-500 -translate-x-1/2"
                style="transform: translateX(calc(-50% - var(--x-offset))) rotate(45deg);"
            ></div>
        </div>
    {/if}
</div>
