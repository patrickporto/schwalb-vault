<script lang="ts">
    import Cropper from 'svelte-easy-crop';
    import getCroppedImg from '$lib/logic/canvas';
    import { X, Check, ZoomIn, RotateCw } from 'lucide-svelte';

    type Props = {
        isOpen: boolean;
        imageUrl: string;
        aspectRatio?: number;
        onClose: () => void;
        onCrop: (blob: Blob) => void;
    };

    let { isOpen = false, imageUrl = '', aspectRatio = 1, onClose, onCrop }: Props = $props();

    let crop = $state({ x: 0, y: 0 });
    let zoom = $state(1);
    let pixelCrop = $state<any>(null);
    let isProcessing = $state(false);

    async function handleSave() {
        console.log('handleSave called', { isProcessing, pixelCrop });
        if (isProcessing || !pixelCrop) return;
        isProcessing = true;
        try {
            console.log('Calling getCroppedImg with', { imageUrl: imageUrl.substring(0, 50) + '...', pixelCrop });
            const croppedBlob = await getCroppedImg(imageUrl, pixelCrop, 0);
            console.log('getCroppedImg result:', croppedBlob);
            if (croppedBlob) {
                onCrop(croppedBlob);
            }
        } catch (e) {
            console.error('Error in handleSave:', e);
        } finally {
            isProcessing = false;
        }
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200" role="dialog" aria-modal="true">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
            <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h3 class="font-bold text-white flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-indigo-500"></div> Editar Imagem</h3>
                <button onclick={onClose} class="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"><X size={20}/></button>
            </div>

            <div class="relative flex-1 bg-black min-h-[400px]">
                <Cropper 
                    image={imageUrl}
                    bind:crop
                    bind:zoom
                    aspect={aspectRatio}
                    oncropcomplete={(data) => {
                        console.log('oncropcomplete prop data:', data);
                        pixelCrop = data.pixels;
                    }}
                    showGrid={true}
                />
            </div>

            <div class="p-4 bg-slate-950 border-t border-slate-800 space-y-4">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 text-slate-400 w-full px-4">
                        <ZoomIn size={16} />
                        <input 
                            type="range" 
                            min="1" 
                            max="3" 
                            step="0.1" 
                            bind:value={zoom}
                            class="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
                
                <div class="flex justify-end gap-3 pt-2">
                    <button onclick={onClose} class="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all text-sm border border-slate-700">Cancelar</button>
                    <button 
                        onclick={handleSave} 
                        disabled={isProcessing}
                        class="px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all text-sm shadow-lg shadow-indigo-900/20 flex items-center gap-2"
                    >
                        {#if isProcessing}
                            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processando...
                        {:else}
                            <Check size={18} /> Salvar Foto
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
