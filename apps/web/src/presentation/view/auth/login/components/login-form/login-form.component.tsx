'use client';

import { Button, Input } from '@portfolio/design-system';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha muito curta'),
});

type LoginForm = z.infer<typeof loginSchema>;
type FormErrors = Partial<Record<keyof LoginForm, string>>;

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(field: keyof LoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as keyof LoginForm] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (res.ok) {
        queryClient.setQueryData(['auth', 'me'], { isAdmin: true });
        router.push('/');
        return;
      }

      const data = (await res.json()) as { error?: string };
      setServerError(data.error ?? 'Erro ao fazer login');
    } catch {
      setServerError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        value={form.email}
        error={errors.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        value={form.password}
        error={errors.password}
        onChange={(e) => handleChange('password', e.target.value)}
      />
      {serverError && <p className="text-sm text-red-400">{serverError}</p>}
      <Button type="submit" isLoading={isLoading} className="mt-2 w-full justify-center">
        Entrar
      </Button>
    </form>
  );
}
