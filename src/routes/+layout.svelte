<script lang="ts">
  import "../app.css";
  import "../i18n";
  import { waitLocale } from 'svelte-i18n';
  import { fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import OfflineBanner from '$lib/components/common/OfflineBanner.svelte';
  import { onMount } from 'svelte';
  import { pwaInfo } from 'virtual:pwa-info';
  import { beforeNavigate } from '$app/navigation';
  import { browser } from '$app/environment';

  let { children } = $props();
  
  // Default to forward navigation (slide from right)
  let transitionX = $state(100);
  let isMobile = $state(false);
  let isNavigatingBack = $state(false);

  onMount(() => {
    if (!browser) return;

    const checkMobile = () => isMobile = window.innerWidth < 768;
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    (async () => {
        if (pwaInfo) {
            const { registerSW } = await import('virtual:pwa-register');
            registerSW({
                immediate: true,
                onRegistered(r) {
                    console.log('SW Registered: ' + r);
                },
                onRegisterError(error) {
                    console.log('SW registration error', error);
                }
            });
        }
    })();

    return () => {
        window.removeEventListener('resize', checkMobile);
    };
  });

  beforeNavigate(({ to, from, type }) => {
    if (!browser || !to || !from) return;
    
    // Determine direction based on URL depth
    const toDepth = to.url.pathname.split('/').filter(Boolean).length;
    const fromDepth = from.url.pathname.split('/').filter(Boolean).length;
    
    // Back = going to home OR shallower path OR popstate (browser back button)
    isNavigatingBack = type === 'popstate' || toDepth < fromDepth || to.url.pathname === '/';
    transitionX = isNavigatingBack ? -100 : 100;
  });

  export async function preload() {
    return waitLocale();
  }
</script>

<svelte:head>
  {@html pwaInfo?.webManifest.linkTag}
</svelte:head>

<OfflineBanner />

{#if isMobile}
    {#key $page.url.pathname}
        <div
            in:fly={{ x: transitionX + '%', duration: 300 }}
            out:fly={{ x: -transitionX + '%', duration: 300, delay: 0 }}
            class="min-h-screen absolute w-full top-0 left-0 bg-slate-900"
        >
            {@render children()}
        </div>
    {/key}
{:else}
    <div class="min-h-screen">
        {@render children()}
    </div>
{/if}
