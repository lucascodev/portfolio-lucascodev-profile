export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  startYear: number;
  endYear: number | null;
  current: boolean;
  order: number;
}
