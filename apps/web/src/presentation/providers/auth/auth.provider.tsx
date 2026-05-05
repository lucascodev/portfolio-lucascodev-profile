'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

interface AuthContextValue {
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ isAdmin: false, isLoading: true });

async function fetchMe(): Promise<{ isAdmin: boolean }> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return { isAdmin: false };
  return res.json() as Promise<{ isAdmin: boolean }>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <AuthContext.Provider value={{ isAdmin: data?.isAdmin ?? false, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
