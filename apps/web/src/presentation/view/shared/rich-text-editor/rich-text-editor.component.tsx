'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={[
        'rounded px-2 py-1 font-mono text-xs transition-colors',
        active
          ? 'bg-[#6EE7B7]/20 text-[#6EE7B7]'
          : 'text-[#737373] hover:bg-[#1A1A1A] hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-[#A3A3A3]">{label}</label>}
      <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] transition-colors focus-within:border-[#6EE7B7]">
        <div className="flex flex-wrap gap-1 border-b border-[#2A2A2A] px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <em>I</em>
          </ToolbarButton>
          <div className="mx-1 w-px self-stretch bg-[#2A2A2A]" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            • Lista
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          >
            1. Lista
          </ToolbarButton>
        </div>
        <EditorContent
          editor={editor}
          className="rich-editor min-h-24 px-3 py-2 text-sm text-white"
        />
      </div>
    </div>
  );
}
