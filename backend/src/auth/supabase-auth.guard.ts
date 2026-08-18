import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

// Verifica el JWT que emite Supabase Auth al loguearse (Arquitectura Técnica,
// módulo de Auth). Se valida acá mismo con el "JWT Secret" del proyecto de
// Supabase (Project Settings → API → JWT Settings) en vez de pegarle a un
// endpoint de Supabase en cada request: es más rápido y no depende de que
// Supabase esté arriba para que el backend siga funcionando.
//
// Nota: esto asume el firmado simétrico (HS256) clásico de Supabase. Si el
// proyecto usa las "signing keys" asimétricas nuevas (JWKS), este guard hay
// que cambiarlo para validar contra el JWKS en vez de un secreto compartido
// (`jwks-rsa` + `jwt.verify(token, getKey, { algorithms: ['RS256'] })`).
export interface RequestConUsuario extends Request {
  usuarioId: string;
  usuarioEmail: string;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader: string | undefined = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta el token de autenticación (header Authorization: Bearer ...)');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      // Falla explícita: mejor romper temprano en desarrollo que dejar pasar
      // requests sin validar de verdad si alguien se olvida de configurarlo.
      throw new UnauthorizedException(
        'El servidor no tiene configurado SUPABASE_JWT_SECRET — no puede validar sesiones',
      );
    }

    try {
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;
      if (!payload.sub) {
        throw new Error('El token no tiene "sub" (id de usuario)');
      }
      req.usuarioId = payload.sub;
      req.usuarioEmail = (payload as any).email ?? null;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
