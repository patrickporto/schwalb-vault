<script lang="ts">
  import { t } from 'svelte-i18n';
  import { character, modalState, damage, effectiveMaxHealth, tempHealth, isInjured, isIncapacitated, damagePercentage, rollHistory, isHistoryOpen, hasUnreadRolls } from '$lib/stores/characterStore';
  import { Settings, Moon, History, ChevronLeft, LayoutDashboard } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import CampaignStatus from './CampaignStatus.svelte';

  import Avatar from '../common/Avatar.svelte';
  import ImageCropperModal from '../common/ImageCropperModal.svelte';
  import { saveImage } from '$lib/logic/image';
  import { Camera, UserCog } from 'lucide-svelte';

  let isMenuOpen = $state(false);
  let isCropperOpen = $state(false);
  let tempImage = $state('');
  let fileInput = $state<HTMLInputElement>();

  function openModal(type: string) {
    modalState.update(m => ({ ...m, type: type, isOpen: true }));
  }

  function handleFileSelect(e: Event) {
       const files = (e.target as HTMLInputElement).files;
       if (files && files.length > 0) {
           const file = files[0];
           const reader = new FileReader();
           reader.onload = () => {
               tempImage = reader.result as string;
               isCropperOpen = true;
               isMenuOpen = false;
           };
           reader.readAsDataURL(file);
       }
       // Reset input
       if (e.target) (e.target as HTMLInputElement).value = '';
   }

   async function handleCrop(blob: Blob) {
        console.log('CharacterHeader: handleCrop started', blob);
        try {
            const hash = await saveImage(blob);
            console.log('CharacterHeader: Image saved, hash:', hash);
            character.update(c => ({ ...c, imageUrl: hash }));
            isCropperOpen = false;
        } catch (e: any) {
            console.error('CharacterHeader: Error in handleCrop:', e);
            alert(e.message || "Erro ao salvar imagem");
        }
   }
</script>

<header class="bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 shadow-2xl">
    <div class="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-3">
       <div class="flex items-center justify-between gap-2 sm:gap-4">

          <!-- Lado Esquerdo: Voltar e Perfil Rapido -->
          <div class="flex items-center gap-3 sm:gap-3">
             <button
                onclick={() => goto(resolve('/'))}
                class="p-2 sm:p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all flex items-center gap-1 group"
                aria-label={$t('character.header.back_dashboard')}
                title={$t('character.header.back_dashboard')}
             >
                <ChevronLeft size={24} class="group-hover:-translate-x-0.5 transition-transform"/>
                <LayoutDashboard size={20} class="hidden sm:block opacity-50"/>
             </button>

             <div class="relative">
                 <button
                    class="flex items-center gap-3 group text-left relative"
                    onclick={() => isMenuOpen = !isMenuOpen}
                    aria-label="Opções do Personagem"
                 >
                    <div class="rounded-xl sm:rounded-full overflow-hidden border-2 border-white/10 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform w-12 h-12 sm:w-12 sm:h-12">
                         <Avatar
                            hash={$character.imageUrl}
                            alt={$character.name}
                            fallbackText={$character.name.charAt(0)}
                            size="custom"
                         />
                    </div>

                    <div>
                       <div class="flex items-center gap-2">
                           <h1 class="text-base sm:text-base font-black text-white leading-tight truncate max-w-[120px] sm:max-w-none group-hover:text-indigo-400 transition-colors">{$character.name}</h1>
                       </div>
                       <p class="hidden xs:block text-xs text-slate-500 font-black uppercase tracking-widest">Nv {$character.level}</p>
                    </div>
                 </button>

                 <!-- Menu Dropdown -->
                 {#if isMenuOpen}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="fixed inset-0 z-40" onclick={() => isMenuOpen = false}></div>
                    <div class="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                        <button
                            onclick={() => fileInput.click()}
                            class="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-700/50"
                        >
                            <Camera size={16} class="text-indigo-400"/> {$t('character.header.change_photo')}
                        </button>
                        <button
                            onclick={() => { openModal('character_info'); isMenuOpen = false; }}
                            class="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-3 transition-colors"
                        >
                            <UserCog size={16} class="text-slate-400"/> {$t('character.header.edit_info')}
                        </button>
                    </div>
                 {/if}
             </div>
          </div>

           <!-- Centro: Vida (Desktop Only) -->
          <button
            class="hidden md:block flex-1 max-w-md cursor-pointer group px-2 sm:px-0 text-left"
            onclick={() => openModal('health')}
            aria-label={$t('character.header.health_label')}
          >
             <div class="flex justify-between text-xs sm:text-sm mb-1.5 px-1">
                <span class="font-black uppercase tracking-wider {$isIncapacitated ? 'text-red-500 animate-pulse' : $isInjured ? 'text-amber-500' : $damage > 0 ? 'text-slate-400' : 'text-emerald-500'}">
                   {#if $isIncapacitated}
                      {$t('character.health.incapacitated')}
                   {:else if $isInjured}
                      {$t('character.health.injured')}
                   {:else if $damage > 0}
                      <!-- Show damage value when not in special state -->
                   {:else}
                      {$t('character.health.healthy')}
                   {/if}
                </span>
                <span class="text-slate-400 font-mono flex items-center gap-1 group-hover:text-white transition-colors">
                  <span class="{$damage === 0 ? 'text-emerald-400' : $isIncapacitated ? 'text-red-400' : $isInjured ? 'text-amber-400' : 'text-orange-400'} font-black group-hover:text-red-300">{$damage}</span><span class="opacity-30">/</span><span class="text-white font-black">{$effectiveMaxHealth}</span>
                </span>
             </div>
             <!-- Health Bar: h-4 mobile, h-6 desktop -->
             <div class="h-4 sm:h-6 w-full bg-slate-950 rounded-full border border-white/5 relative overflow-hidden group-hover:border-white/20 transition-all shadow-inner">
                <!-- Background health indicator -->
                <div class="absolute top-0 left-0 h-full w-full {$damage === 0 ? 'bg-emerald-900/20' : 'bg-slate-900/50'}"></div>

                <!-- Damage fill bar with dynamic gradient -->
                {#if $damagePercentage > 0}
                <div
                    class="absolute top-0 left-0 h-full transition-all duration-500 ease-out z-10 {$isIncapacitated ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-500 animate-pulse' : $damagePercentage >= 80 ? 'bg-gradient-to-r from-red-600 to-rose-500' : $isInjured ? 'bg-gradient-to-r from-amber-600 to-orange-500' : 'bg-gradient-to-r from-orange-500 to-amber-400'}"
                    style="width: {$damagePercentage}%"
                >
                    <!-- Shine effect -->
                    <div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                </div>
                {/if}

                <!-- Healthy glow when no damage -->
                {#if $damage === 0}
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20 z-10">
                    <div class="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                </div>
                {/if}

                <!-- Temp health overlay -->
                {#if $tempHealth > 0}<div class="absolute top-0 left-0 w-full h-full z-20 bg-cyan-400/20 pointer-events-none animate-pulse"></div>{/if}
             </div>
          </button>

          <!-- Lado Direito: Ações -->
          <div class="flex items-center gap-1 sm:gap-2">
             <button
                onclick={() => openModal('rest_confirm')}
                class="p-2 sm:p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-full transition-all"
                title={$t('character.header.rest')}
             >
                <Moon size={20}/>
             </button>

             <button
                onclick={() => isHistoryOpen.update(v => !v)}
                class="p-2 bg-indigo-600/10 text-indigo-400 border border-indigo-400/20 rounded-lg hover:bg-indigo-600 hover:text-white transition-all relative"
                aria-label={$t('character.header.history')}
                title={$t('character.header.history')}
                aria-pressed={$isHistoryOpen}
             >
                 <History size={20}/>
                 {#if $hasUnreadRolls === true}
                    <span class="absolute -top-1 -right-1 flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-slate-900"></span>
                    </span>
                 {/if}
             </button>

             <button
                onclick={() => openModal('character_info')}
                class="hidden sm:flex p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                title={$t('common.buttons.settings')}
             >
                <Settings size={18}/>
             </button>
          </div>
       </div>
    </div>

    <!-- Mobile Health Complement -->
    <div class="md:hidden border-t border-white/5 bg-slate-950/20">
        <button
            class="w-full px-4 py-2 text-left active:bg-white/5 transition-colors"
            onclick={() => openModal('health')}
            aria-label={$t('character.header.health_label')}
        >
            <div class="flex justify-between text-[10px] mb-1">
                <span class="font-black uppercase tracking-widest {$isIncapacitated ? 'text-red-500 animate-pulse' : $isInjured ? 'text-amber-500' : $damage > 0 ? 'text-slate-400' : 'text-emerald-500'}">
                    {#if $isIncapacitated}
                        {$t('character.health.incapacitated')}
                    {:else if $isInjured}
                        {$t('character.health.injured')}
                    {:else}
                        {$t('character.health.healthy')}
                    {/if}
                </span>
                <span class="text-slate-300 font-mono font-black">
                    <span class="{$damage === 0 ? 'text-emerald-400' : $isIncapacitated ? 'text-red-400' : $isInjured ? 'text-amber-400' : 'text-orange-400'}">{$damage}</span> / {$effectiveMaxHealth}
                </span>
            </div>
            <div class="h-2 w-full bg-slate-950 rounded-full border border-white/5 relative overflow-hidden shadow-inner">
                <div class="absolute top-0 left-0 h-full w-full {$damage === 0 ? 'bg-emerald-900/20' : 'bg-slate-900/50'}"></div>
                {#if $damagePercentage > 0}
                <div
                    class="absolute top-0 left-0 h-full transition-all duration-500 ease-out z-10 {$isIncapacitated ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-500 animate-pulse' : $damagePercentage >= 80 ? 'bg-gradient-to-r from-red-600 to-rose-500' : $isInjured ? 'bg-gradient-to-r from-amber-600 to-orange-500' : 'bg-gradient-to-r from-orange-500 to-amber-400'}"
                    style="width: {$damagePercentage}%"
                >
                    <div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                </div>
                {/if}
                {#if $damage === 0}
                <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-emerald-500/20 z-10"></div>
                {/if}
                {#if $tempHealth > 0}<div class="absolute top-0 left-0 w-full h-full z-20 bg-cyan-400/20 pointer-events-none animate-pulse"></div>{/if}
            </div>
        </button>
    </div>
</header>


<input
    type="file"
    bind:this={fileInput}
    onchange={handleFileSelect}
    hidden
    accept="image/*"
/>

<ImageCropperModal
    isOpen={isCropperOpen}
    imageUrl={tempImage}
    onClose={() => isCropperOpen = false}
    onCrop={handleCrop}
/>

<style>
    /* Suporte para telas muito pequenas */
    @media (max-width: 350px) {
        .xs\:block {
            display: none !important;
        }
    }
</style>
