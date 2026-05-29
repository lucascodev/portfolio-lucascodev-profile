import type { Certification } from '../../entities/certification/certification.entity';

export interface CreateCertificationInput {
  name: string;
  issuer: string;
  year?: number | null;
  url?: string | null;
  order?: number;
}

export interface UpdateCertificationInput {
  name?: string;
  issuer?: string;
  year?: number | null;
  url?: string | null;
  order?: number;
}

export interface CertificationRepository {
  findAll(): Promise<Certification[]>;
  create(data: CreateCertificationInput): Promise<Certification>;
  update(id: string, data: UpdateCertificationInput): Promise<Certification>;
  delete(id: string): Promise<void>;
}
