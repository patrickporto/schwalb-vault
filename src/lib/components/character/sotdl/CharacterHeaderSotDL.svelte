<script lang="ts">
    import { t } from 'svelte-i18n';
    import { sotdlCharacter, sotdlCurrentHealth, sotdlIsInjured, sotdlIsIncapacitated } from '$lib/stores/characterStoreSotDL';
    import { Settings, ChevronLeft, LayoutDashboard, Brain, Skull } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import Avatar from '$lib/components/common/Avatar.svelte';
    import { fade } from 'svelte/transition';

    import { modalState } from '$lib/stores/characterStore';
    import ImageCropperModal from '$lib/components/common/ImageCropperModal.svelte';
    import { saveImage } from '$lib/logic/image';
    import { Camera, UserCog } from 'lucide-svelte';

    let currentHealthPercentage = $derived(($sotdlCharacter.health > 0) ? (($sotdlCurrentHealth / $sotdlCharacter.health) * 100) : 0);

    let isMenuOpen = $state(false);
    let isCropperOpen = $state(false);
    let tempImage = $state('');
    let fileInput = $state<HTMLInputElement>();

    function openModal(type: string, data: any = {}) {
        modalState.update(m => ({ ...m, type, isOpen: true, data }));
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
       if (e.target) (e.target as HTMLInputElement).value = '';
   }

   async function handleCrop(blob: Blob) {
        try {
            const hash = await saveImage(blob);
            sotdlCharacter.update(c => ({ ...c, imageUrl: hash }));
            isCropperOpen = false;
        } catch (e: any) {
            alert(e.message || "Erro ao salvar imagem");
        }
   }
</script>

<header class="bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 shadow-2xl">
    <div class="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-3">
       <div class="flex items-center justify-between gap-2 sm:gap-4">

            <!-- Left: Back & Profile -->
            <div class="flex items-center gap-3 sm:gap-3">
                <button
                    onclick={() => goto(resolve('/'))}
                    class="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all flex items-center gap-1 group"
                >
                    <ChevronLeft size={24} class="group-hover:-translate-x-0.5 transition-transform"/>
                    <LayoutDashboard size={20} class="hidden sm:block opacity-50"/>
                </button>

                <div class="relative">
                    <button
                        class="flex items-center gap-3 group text-left relative"
                        onclick={() => isMenuOpen = !isMenuOpen}
                    >
                        <div class="rounded-xl sm:rounded-full overflow-hidden border-2 border-white/10 w-12 h-12">
                             <Avatar hash={$sotdlCharacter.imageUrl} alt={$sotdlCharacter.name} fallbackText={$sotdlCharacter.name.charAt(0)} size="custom" />
                        </div>
                        <div>
                            <h1 class="text-base font-black text-white leading-tight truncate max-w-[120px]">{$sotdlCharacter.name}</h1>
                            <p class="text-xs text-slate-500 font-black uppercase tracking-widest">Nv {$sotdlCharacter.level} • SotDL</p>
                        </div>
                    </button>

                    <!-- Menu Dropdown -->
                    {#if isMenuOpen}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div class="fixed inset-0 z-40" onclick={() => isMenuOpen = false}></div>
                        <div class="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                            <button
                                onclick={() => fileInput?.click()}
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

            <!-- Center: Health Bar & Stats -->
            <div class="hidden md:flex flex-1 max-w-lg gap-6 items-center justify-center">
                 <!-- Stats Trackers -->
                 <div class="flex gap-4">
                     <button onclick={() => openModal('stat', { system: 'sofdl', key: 'insanity' })} class="flex flex-col items-center hover:opacity-80 transition-opacity">
                         <span class="text-[10px] uppercase font-black tracking-wider text-purple-400 flex items-center gap-1"><Brain size={12}/> {$t('sofdl.attributes.insanity')}</span>
                         <span class="text-lg font-black text-white">{$sotdlCharacter.insanity}</span>
                     </button>
                     <button onclick={() => openModal('stat', { system: 'sofdl', key: 'corruption' })} class="flex flex-col items-center hover:opacity-80 transition-opacity">
                         <span class="text-[10px] uppercase font-black tracking-wider text-red-500 flex items-center gap-1"><Skull size={12}/> {$t('sofdl.attributes.corruption')}</span>
                         <span class="text-lg font-black text-white">{$sotdlCharacter.corruption}</span>
                     </button>
                 </div>

                 <!-- Health (WW Style) -->
                 <button
                    class="flex-1 max-w-md cursor-pointer group px-2 text-left"
                    onclick={() => openModal('health_damage')}
                 >
                    <div class="flex justify-between text-xs sm:text-sm mb-1.5 px-1">
                        <span class="font-black uppercase tracking-wider {$sotdlIsIncapacitated ? 'text-red-500 animate-pulse' : $sotdlIsInjured ? 'text-amber-500' : 'text-emerald-500'}">
                            {#if $sotdlIsIncapacitated}
                                {$t('character.health.incapacitated')}
                            {:else if $sotdlIsInjured}
                                {$t('character.health.injured')}
                            {:else}
                                {$t('character.health.healthy')}
                            {/if}
                        </span>
                        <span class="text-slate-400 font-mono flex items-center gap-1 group-hover:text-white transition-colors">
                            <span class="{$sotdlIsIncapacitated ? 'text-red-400' : $sotdlIsInjured ? 'text-amber-400' : 'text-emerald-400'} font-black">{$sotdlCurrentHealth}</span>
                        </span>
                    </div>

                    <!-- Health Bar: h-4 mobile, h-6 desktop -->
                    <div class="h-4 sm:h-6 w-full bg-slate-950 rounded-full border border-white/5 relative overflow-hidden group-hover:border-white/20 transition-all shadow-inner">
                        <!-- Background -->
                         <div class="absolute top-0 left-0 h-full w-full bg-slate-900/50"></div>

                         <!-- Fill Bar (Shrinking logic for Current Health) -->
                         <div
                            class="absolute top-0 left-0 h-full transition-all duration-500 ease-out z-10 {$sotdlIsIncapacitated ? 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse' : $sotdlIsInjured ? 'bg-gradient-to-r from-amber-600 to-orange-500' : 'bg-gradient-to-r from-emerald-600 to-green-500'}"
                            style="width: {currentHealthPercentage}%"
                         >
                            <!-- Shine effect -->
                            <div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                         </div>
                    </div>
                 </button>
            </div>

            <!-- Right: Actions -->
            <div class="flex items-center gap-2">
                 <button
                    onclick={() => openModal('character_info')}
                    class="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full"
                    title={$t('character.header.settings')}
                >
                     <Settings size={20}/>
                 </button>
            </div>
       </div>
    </div>

    <!-- Mobile Stats (Below) -->
    <div class="md:hidden border-t border-white/5 bg-slate-950/20 px-4 py-2 flex justify-between gap-4">
        <button onclick={() => openModal('health_damage')} class="flex-1 text-left">
             <div class="h-2 bg-slate-950 rounded-full border border-white/5 overflow-hidden relative shadow-inner">
                 <div class="absolute top-0 left-0 h-full bg-slate-900/50 w-full"></div>
                 <div
                    class="absolute top-0 left-0 h-full transition-all duration-500 ease-out z-10 {$sotdlIsIncapacitated ? 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse' : $sotdlIsInjured ? 'bg-gradient-to-r from-amber-600 to-orange-500' : 'bg-gradient-to-r from-emerald-600 to-green-500'}"
                    style="width: {currentHealthPercentage}%"
                 ></div>
             </div>
             <div class="flex justify-between text-[10px] mt-1 text-slate-500 font-bold uppercase">
                 <span>HP</span>
                 <span class="text-slate-300 font-mono font-black">{$sotdlCurrentHealth}</span>
             </div>
        </button>
        <div class="flex gap-4">
             <button onclick={() => openModal('stat', { system: 'sofdl', key: 'insanity' })} class="flex items-center gap-1 text-xs font-black text-purple-400">
                 <Brain size={12}/> <span>{$sotdlCharacter.insanity}</span>
             </button>
             <button onclick={() => openModal('stat', { system: 'sofdl', key: 'corruption' })} class="flex items-center gap-1 text-xs font-black text-red-900">
                 <Skull size={12}/> <span>{$sotdlCharacter.corruption}</span>
             </button>
        </div>
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
