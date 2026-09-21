export interface AuthUser {
  idUsuario: string;
  idEmpresa: string;
  nombre: string;
  correo: string;
  passwordHash: string;
  rol: "USUARIO" | "ADMINISTRADOR";
  estado: "PENDIENTE" | "ACTIVO" | "BLOQUEADO" | "INACTIVO";
  debeCambiarPassword: boolean;
  bloqueadoHasta: Date | null;
  correoVerificadoAt: Date | null;
}

export type SecurityCodePurpose =
  "CODIGO_INICIO_SESION" | "RECUPERACION_PASSWORD";

export interface SecurityCodeChallenge {
  idToken: string;
  idUsuario: string;
  tipo: SecurityCodePurpose;
  tokenHash: string;
  cantidadIntentos: number;
  createdAt: Date;
  expiresAt: Date;
  usedAt: Date | null;
  revokedAt: Date | null;
  usuario: AuthUser;
}

export type LoginChallenge = SecurityCodeChallenge;

export interface AuthSession {
  idSesion: string;
  idUsuario: string;
  tokenHash: string;
  recordarSesion: boolean;
  createdAt: Date;
  ultimaActividadAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  usuario: AuthUser;
}
