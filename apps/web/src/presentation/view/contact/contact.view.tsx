import { Text } from '@portfolio/design-system';
import { ContactForm } from './components/contact-form/contact-form.component';

export function ContactView() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Text variant="h2" className="mb-2">
        Contato
      </Text>
      <Text variant="body" color="secondary" className="mb-10">
        Tem um projeto em mente? Vamos conversar.
      </Text>
      <ContactForm />
    </main>
  );
}
