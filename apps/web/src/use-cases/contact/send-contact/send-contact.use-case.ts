import type { ContactMessage, ContactRepository } from '@/domain/repositories/contact/contact.repository';

export class SendContactUseCase {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(message: ContactMessage): Promise<void> {
    await this.contactRepository.save(message);
  }
}
