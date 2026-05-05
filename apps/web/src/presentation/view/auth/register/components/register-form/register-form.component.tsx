'use client';

import { Button } from '@portfolio/design-system';
import Link from 'next/link';

export function RegisterForm() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex flex-col gap-2">
        <p className="text-[#A3A3A3]">
          Este é um portfólio pessoal. O registro público não está disponível.
        </p>
        <p className="text-sm text-[#525252]">
          Se você é o dono do portfólio, faça login com suas credenciais de administrador.
        </p>
      </div>
      <Link href="/login">
        <Button variant="primary">Ir para o login</Button>
      </Link>
    </div>
  );
}
