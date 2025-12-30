<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Editor } from '@tiptap/core';
    import StarterKit from '@tiptap/starter-kit';
    import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
    import FloatingMenuExtension from '@tiptap/extension-floating-menu';
    import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Code } from 'lucide-svelte';
    import { fade } from 'svelte/transition';

    let { value = $bindable(''), placeholder = 'Digite suas notas...' } = $props();

    let element: HTMLElement;
    let editor: Editor | null = $state(null);
    let bubbleMenuElement: HTMLElement;
    let floatingMenuElement: HTMLElement;

    onMount(() => {
        editor = new Editor({
            element: element,
            extensions: [
                StarterKit.configure({
                    heading: {
                        levels: [1, 2]
                    }
                }),
                BubbleMenuExtension.configure({
                    element: bubbleMenuElement
                }),
                FloatingMenuExtension.configure({
                    element: floatingMenuElement
                })
            ],
            content: value,
            editorProps: {
                attributes: {
                    class: 'focus:outline-none min-h-[60vh] p-4 pb-32 text-slate-300 leading-relaxed text-base md:text-sm'
                }
            },
            onUpdate: ({ editor }) => {
                value = editor.getHTML();
            },
        });
    });

    onDestroy(() => {
        if (editor) {
            editor.destroy();
        }
    });

    // Reactive update if value changes externally (e.g. initial load or character switch)
    $effect(() => {
        if (editor && value !== undefined && editor.getHTML() !== value) {
             editor.commands.setContent(value);
        }
    });

</script>

<div class="relative bg-slate-950/50 border border-slate-800 rounded-xl group focus-within:border-indigo-500/50 transition-all">

    <!-- Bubble Menu (Selected Text) -->
    <div bind:this={bubbleMenuElement} class="flex items-center bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-1 gap-0.5 z-[100]">
        {#if editor}
            <button
                onclick={() => editor?.chain().focus().toggleBold().run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('bold') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
            >
                <Bold size={18} />
            </button>
            <button
                onclick={() => editor?.chain().focus().toggleItalic().run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('italic') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
            >
                <Italic size={18} />
            </button>
            <button
                onclick={() => editor?.chain().focus().toggleStrike().run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('strike') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
            >
                <Strikethrough size={18} />
            </button>
            <div class="w-px h-4 bg-slate-700 mx-1"></div>
            <button
                onclick={() => editor?.chain().focus().toggleCode().run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('code') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
            >
                <Code size={18} />
            </button>
        {/if}
    </div>

    <!-- Floating Menu (Empty Line) -->
    <div bind:this={floatingMenuElement} class="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-1 z-[100]">
        {#if editor}
            <button
                onclick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('heading', { level: 1 }) ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
                title="Heading 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('heading', { level: 2 }) ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>
            <button
                onclick={() => editor?.chain().focus().toggleBulletList().run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('bulletList') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                onclick={() => editor?.chain().focus().toggleOrderedList().run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('orderedList') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>
            <button
                onclick={() => editor?.chain().focus().toggleBlockquote().run()}
                class="p-2.5 md:p-2 hover:bg-slate-800 transition-colors rounded-lg {editor.isActive('blockquote') ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'}"
                title="Quote"
            >
                <Quote size={18} />
            </button>
        {/if}
    </div>

    <div bind:this={element} class="custom-scrollbar max-h-[70vh] overflow-y-auto w-full"></div>
</div>

<style>
    /* Custom Scrollbar for the editor content */
    :global(.ProseMirror) {
        min-height: 100px;
    }
    :global(.ProseMirror:focus) {
        outline: none;
    }
    :global(.tiptap p.is-editor-empty:first-child::before) {
        color: #475569;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }

    /* Manual Typography Styles since plugin is missing */
    :global(.ProseMirror h1) {
        font-size: 1.875rem;
        line-height: 2.25rem;
        font-weight: 700;
        color: #818cf8; /* indigo-400 */
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    :global(.ProseMirror h2) {
        font-size: 1.5rem;
        line-height: 2rem;
        font-weight: 700;
        color: #818cf8; /* indigo-400 */
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    :global(.ProseMirror ul) {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin-bottom: 1rem;
    }
    :global(.ProseMirror ol) {
        list-style-type: decimal;
        padding-left: 1.5rem;
        margin-bottom: 1rem;
    }
    :global(.ProseMirror li) {
        margin-bottom: 0.25rem;
    }
    :global(.ProseMirror blockquote) {
        border-left-width: 4px;
        border-color: #6366f1; /* indigo-500 */
        padding-left: 1rem;
        font-style: italic;
        color: #94a3b8; /* slate-400 */
        margin-bottom: 1rem;
    }
    :global(.ProseMirror pre) {
        background-color: #0f172a; /* slate-900 */
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    :global(.ProseMirror code) {
        background-color: #1e293b; /* slate-800 */
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        color: #a5b4fc; /* indigo-300 */
    }
    :global(.ProseMirror p) {
        margin-bottom: 1rem;
    }
</style>
