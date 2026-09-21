import type { Request } from 'express';

export interface AdminIdentity {
  idUsuario: string;
  rol: 'ADMINISTRADOR';
}

export type AdminResolver = (request: Request) => Promise<AdminIdentity | null>;

export const denyAllAdminResolver: AdminResolver = async () => null;
