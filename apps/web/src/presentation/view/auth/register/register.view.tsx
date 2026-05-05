import Link from 'next/link';
import { Text } from '@portfolio/design-system';
import { RegisterForm } from './components/register-form/register-form.component';

export function RegisterView() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-mono text-sm font-semibold text-white transition-colors hover:text-[#6EE7B7]"
          >
            lucascodev<span className="text-[#6EE7B7]">.</span>
          </Link>
          <Text variant="h3" className="mt-6 mb-2">
            Criar conta
          </Text>
          <Text variant="small" color="secondary">
            Acesso ao painel administrativo
          </Text>
        </div>

        <div className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-8">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-[#737373]">
          Já tem conta?{' '}
          <Link href="/login" className="text-[#6EE7B7] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
