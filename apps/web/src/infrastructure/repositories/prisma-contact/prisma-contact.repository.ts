import type { ContactMessage, ContactRepository } from '@/domain/repositories/contact/contact.repository';
import { prisma } from '@/shared/lib/prisma/prisma.lib';

export class PrismaContactRepository implements ContactRepository {
  async save(message: ContactMessage): Promise<void> {
    await prisma.contact.create({ data: message });
  }
}
