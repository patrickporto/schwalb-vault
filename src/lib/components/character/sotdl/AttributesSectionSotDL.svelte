<script lang="ts">
    import { t } from 'svelte-i18n';
    import { sotdlCharacter, sotdlModifiers, sotdlAttributes } from '$lib/stores/characterStoreSotDL';
    import { modalState } from '$lib/stores/characterStore';
    import { Edit } from 'lucide-svelte';

    function openModal(type: string, data: any) {
        modalState.update(m => ({ ...m, type, isOpen: true, data }));
    }

    function handleAttributeClick(key: string) {
        openModal('pre_roll', { type: 'attribute', system: 'sofdl', key });
    }

    function handleEditClick(e: MouseEvent, key: string) {
        e.stopPropagation();
        openModal('attribute', { system: 'sofdl', key, value: $sotdlCharacter.attributes[key as keyof typeof $sotdlCharacter.attributes] });
    }

    const attrs = [
        { key: 'strength', label: 'sofdl.attributes.strength' },
        { key: 'agility', label: 'sofdl.attributes.agility' },
        { key: 'intellect', label: 'sofdl.attributes.intellect' },
        { key: 'will', label: 'sofdl.attributes.will' }
    ];
</script>

<div class="grid grid-cols-2 gap-3">
    {#each attrs as attr}
       <!-- svelte-ignore a11y_click_events_have_key_events -->
       <div
           onclick={() => handleAttributeClick(attr.key)}
           class="bg-slate-900 overflow-hidden rounded-2xl border border-slate-800 text-center transition-all hover:bg-slate-800 active:scale-[0.98] group relative shadow-lg shadow-black/20 cursor-pointer"
           role="button"
           tabindex="0"
           aria-label={`${$t(attr.label)} roll`}
       >
          <div class="py-2.5 px-2">
            <div class="text-[9px] uppercase text-slate-500 font-black tracking-widest group-hover:text-indigo-400 transition-colors mb-1">{$t(attr.label)}</div>

            <div class="flex items-center justify-center gap-1.5 mb-1.5">
                <div class="text-2xl font-black text-white leading-none">
                    {$sotdlAttributes[attr.key as keyof typeof $sotdlAttributes]}
                </div>
            </div>

            <div class="inline-flex px-2 py-0.5 bg-indigo-500/10 rounded-lg">
                <div class="text-xs text-indigo-400 font-black tracking-tight">
                    {$sotdlModifiers[attr.key as keyof typeof $sotdlModifiers] >= 0 ? '+' : ''}{$sotdlModifiers[attr.key as keyof typeof $sotdlModifiers]}
                </div>
            </div>
          </div>

          <button
              onclick={(e) => handleEditClick(e, attr.key)}
              class="absolute top-1.5 right-1.5 p-1 text-slate-700 hover:text-white hover:bg-white/5 rounded-md transition-all opacity-0 group-hover:opacity-100"
              aria-label={`${$t('common.buttons.edit')} ${$t(attr.label)}`}
          >
              <Edit size={12} />
          </button>
       </div>
    {/each}
 </div>
