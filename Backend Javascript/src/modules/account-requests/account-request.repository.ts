import type {
  AccountRequest,
  AccountRequestStatus,
  ApprovalResult,
  Company,
  User,
} from './account-request.types.js';
import type { CreateAccountRequestInput } from './account-request.schemas.js';

export interface ApproveRequestData {
  idSolicitud: string;
  adminId: string;
  reviewedAt: Date;
  company: Company;
  user: User;
}

export interface AccountRequestRepository {
  create(input: CreateAccountRequestInput, id: string, now: Date): Promise<AccountRequest>;
  list(status?: AccountRequestStatus): Promise<AccountRequest[]>;
  findById(id: string): Promise<AccountRequest | null>;
  approve(data: ApproveRequestData): Promise<ApprovalResult>;
  reject(id: string, adminId: string, reason: string, reviewedAt: Date): Promise<AccountRequest>;
}
