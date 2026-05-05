export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  techStack: string[];
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  order: number;
}
