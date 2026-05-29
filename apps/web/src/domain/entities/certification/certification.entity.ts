export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number | null;
  url: string | null;
  order: number;
}
