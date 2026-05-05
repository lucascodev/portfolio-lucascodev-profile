export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactRepository {
  save(message: ContactMessage): Promise<void>;
}
