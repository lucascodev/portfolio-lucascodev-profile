interface MailDraft {
  readonly to: string;
  readonly subject: string;
  readonly body: string;
}

export function buildMailtoUrl({ to, subject, body }: MailDraft): string {
  const query = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20');
  return `mailto:${to}?${query}`;
}
