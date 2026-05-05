import { useMutation } from '@tanstack/react-query';
import type { ContactMessage } from '@/domain/repositories/contact/contact.repository';

async function postContact(message: ContactMessage): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Failed to send message');
}

export function useSendContact() {
  return useMutation({ mutationFn: postContact });
}
