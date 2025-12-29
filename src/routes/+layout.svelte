<script lang="ts">
  import "../app.css";
  import "../i18n";
  import { waitLocale } from 'svelte-i18n';
  import { fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import OfflineBanner from '$lib/components/common/OfflineBanner.svelte';
  import { onMount } from 'svelte';
  import { pwaInfo } from 'virtual:pwa-info';

  let { children } = $props();

  onMount(async () => {
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
  });

  export async function preload() {
    return waitLocale();
  }
</script>

<svelte:head>
  {@html pwaInfo?.webManifest.linkTag}
</svelte:head>

<OfflineBanner />

{#key $page.url.pathname}
    <div
        in:fly={{ x: '100vw', duration: 300, delay: 300 }}
        out:fly={{ x: '-100vw', duration: 300 }}
        class="min-h-screen"
    >
        {@render children()}
    </div>
{/key}
