'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Input, Button, Text } from '@portfolio/design-system';
import { useSendContact } from '@/presentation/hooks/use-send-contact/use-send-contact.hook';

const contactSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  subject: z.string().min(3, 'Assunto muito curto'),
  message: z.string().min(10, 'Mensagem muito curta'),
});

type ContactForm = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof ContactForm, string>>;

const INITIAL_FORM: ContactForm = { name: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const { mutate, isPending, isSuccess } = useSendContact();

  function handleChange(field: keyof ContactForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactForm;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    mutate(parsed.data, { onSuccess: () => setForm(INITIAL_FORM) });
  }

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/5 p-8 text-center">
        <Text variant="h4" className="mb-2 text-[#22C55E]">
          Mensagem enviada!
        </Text>
        <Text color="secondary">Retornarei em breve. Obrigado pelo contato.</Text>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nome"
          placeholder="Seu nome"
          value={form.name}
          error={errors.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={form.email}
          error={errors.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>
      <Input
        label="Assunto"
        placeholder="Sobre o que você quer falar?"
        value={form.subject}
        error={errors.subject}
        onChange={(e) => handleChange('subject', e.target.value)}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#A3A3A3]">Mensagem</label>
        <textarea
          rows={6}
          placeholder="Sua mensagem..."
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={[
            'w-full resize-none rounded-lg border bg-[#111111] px-3 py-2.5 text-sm text-white placeholder:text-[#404040]',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-black',
            errors.message
              ? 'border-[#EF4444] focus:ring-[#EF4444]'
              : 'border-[#2A2A2A] focus:ring-[#6EE7B7] focus:border-[#6EE7B7]',
          ].join(' ')}
        />
        {errors.message && <p className="text-xs text-[#EF4444]">{errors.message}</p>}
      </div>
      <Button type="submit" isLoading={isPending} className="self-end">
        Enviar mensagem
      </Button>
    </form>
  );
}
