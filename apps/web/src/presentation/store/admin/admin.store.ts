import { create } from 'zustand';

interface AdminStore {
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
  toggleEditMode: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isEditMode: false,
  setEditMode: (value) => set({ isEditMode: value }),
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
}));
