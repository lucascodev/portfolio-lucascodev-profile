export interface ConsentStorage {
  hasAccepted(): boolean;
  saveAcceptance(): void;
}
