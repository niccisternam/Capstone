import type { AdminResolver } from './admin-resolver.js';
import type { AuthRepository } from '../../modules/auth/auth.repository.js';
import type { JwtService } from '../../modules/auth/jwt.service.js';

export function createJwtAdminResolver(jwt: JwtService, repository: AuthRepository): AdminResolver {
  return async (request) => {
    const match = /^Bearer\s+(.+)$/i.exec(request.headers.authorization ?? '');
    if (!match?.[1]) return null;

    try {
      const identity = await jwt.verifyAccessToken(match[1]);
      if (identity.rol !== 'ADMINISTRADOR') return null;
      const user = await repository.findUserById(identity.idUsuario);
      if (!user || user.rol !== 'ADMINISTRADOR' || user.estado !== 'ACTIVO') return null;
      return { idUsuario: user.idUsuario, rol: 'ADMINISTRADOR' };
    } catch {
      return null;
    }
  };
}
