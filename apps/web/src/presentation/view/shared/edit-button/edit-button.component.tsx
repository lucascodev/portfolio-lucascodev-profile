'use client';

interface EditButtonProps {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
}

export function EditButton({ onClick, label = 'Editar' }: EditButtonProps) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 rounded-full border border-[#2A2A2A] bg-[#111111] px-2.5 py-1 text-xs font-medium text-[#A3A3A3] shadow-md transition-colors hover:border-[#6EE7B7] hover:text-[#6EE7B7]"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      {label}
    </button>
  );
}
