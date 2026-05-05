'use client';

import { useAuth } from '@/presentation/providers/auth/auth.provider';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function AdminToolbar() {
  const { isAdmin } = useAuth();
  const { isEditMode, toggleEditMode, setEditMode } = useAdminStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (!isAdmin) return null;

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setEditMode(false);
    void queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-[#2A2A2A] bg-[#111111] px-5 py-3 shadow-2xl">
        <span className="font-mono text-xs text-[#6EE7B7]">Admin</span>
        <div className="h-3 w-px bg-[#2A2A2A]" />
        <button
          onClick={toggleEditMode}
          className={[
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            isEditMode ? 'bg-[#6EE7B7] text-black' : 'bg-[#1A1A1A] text-[#A3A3A3] hover:text-white',
          ].join(' ')}
        >
          {isEditMode ? 'Edição ON' : 'Edição OFF'}
        </button>
        <div className="h-3 w-px bg-[#2A2A2A]" />
        <button
          onClick={handleLogout}
          className="rounded-full px-3 py-1 text-xs font-medium text-[#A3A3A3] transition-colors hover:text-red-400"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
