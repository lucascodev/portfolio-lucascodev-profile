'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={[
        'rounded px-2 py-1 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30',
        active
          ? 'bg-[#6EE7B7]/20 text-[#6EE7B7]'
          : 'text-[#737373] hover:bg-[#1A1A1A] hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 w-px self-stretch bg-[#2A2A2A]" />;
}

export function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom as HTMLElement;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      if (e.shiftKey) {
        editor.chain().focus().liftListItem('listItem').run();
      } else {
        editor.chain().focus().sinkListItem('listItem').run();
      }
    }
    dom.addEventListener('keydown', onKeyDown);
    return () => dom.removeEventListener('keydown', onKeyDown);
  }, [editor]);

  if (!editor) return null;

  const inList = editor.isActive('bulletList') || editor.isActive('orderedList');

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-[#A3A3A3]">{label}</label>}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] transition-colors focus-within:border-[#6EE7B7]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#2A2A2A] px-2 py-1.5">
          {/* Text formatting */}
          <ToolbarButton
            title="Negrito (Ctrl+B)"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            title="Itálico (Ctrl+I)"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            title="Tachado"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
          >
            <s>S</s>
          </ToolbarButton>

          <Divider />

          {/* Lists */}
          <ToolbarButton
            title="Lista com marcadores"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            • Lista
          </ToolbarButton>
          <ToolbarButton
            title="Lista numerada"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          >
            1. Lista
          </ToolbarButton>

          <Divider />

          {/* Indent / Outdent — só habilitado dentro de lista */}
          <ToolbarButton
            title="Recuar (Tab)"
            disabled={!inList || !editor.can().sinkListItem('listItem')}
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          >
            ⇥
          </ToolbarButton>
          <ToolbarButton
            title="Desfazer recuo (Shift+Tab)"
            disabled={!inList || !editor.can().liftListItem('listItem')}
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          >
            ⇤
          </ToolbarButton>

          <Divider />

          {/* Undo / Redo */}
          <ToolbarButton
            title="Desfazer (Ctrl+Z)"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            ↩
          </ToolbarButton>
          <ToolbarButton
            title="Refazer (Ctrl+Y)"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            ↪
          </ToolbarButton>
        </div>

        <EditorContent
          editor={editor}
          className="rich-editor min-h-24 px-3 py-2 text-sm text-white"
        />
      </div>

      <p className="text-[10px] text-[#525252]">
        Dica: pressione Enter para novo parágrafo/item. Use Tab / Shift+Tab para recuar sublistas.
      </p>
    </div>
  );
}
