import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import jwksClient, { JwksClient } from 'jwks-rsa';

// Verifica el JWT que emite Supabase Auth al loguearse (Arquitectura Técnica,
// módulo de Auth). Supabase firma esos JWT de dos formas posibles, según
// cómo esté configurado el proyecto (Supabase → Authentication → JWT Keys):
// - Proyectos con el modo viejo "Legacy JWT Secret" activo: HS256, firmado
//   con un secreto compartido (SUPABASE_JWT_SECRET).
// - Proyectos con las "signing keys" nuevas (el default en proyectos creados
//   desde 2024/2025, como este): ES256/RS256, firmado con una clave privada
//   que Supabase no comparte — se valida contra la clave pública publicada
//   en `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`.
// Este guard mira el "alg" del header del token y usa el método que
// corresponda, así funciona con cualquiera de los dos modos sin tocar código
// si el proyecto cambia de uno a otro.
export interface RequestConUsuario extends Request {
  usuarioId: string;
  usuarioEmail: string;
}

let jwks: JwksClient | null = null;
function getJwksClient(): JwksClient {
  if (!jwks) {
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error(
        'Falta SUPABASE_URL en backend/.env — hace falta para validar los tokens firmados con las signing keys nuevas de Supabase (Project Settings → API → Project URL).',
      );
    }
    jwks = jwksClient({
      jwksUri: `${supabaseUrl.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`,
      cache: true,
      cacheMaxAge: 10 * 60 * 1000, // 10 min — no golpear el JWKS en cada request
      rateLimit: true,
    });
  }
  return jwks;
}

async function verificarToken(token: string): Promise<jwt.JwtPayload> {
  const decoded = jwt.decode(token, { complete: true });
  const header = decoded?.header;
  if (!header) {
    throw new Error('Token malformado');
  }

  if (header.alg === 'HS256') {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new Error('El servidor no tiene configurado SUPABASE_JWT_SECRET — no puede validar sesiones HS256');
    }
    return jwt.verify(token, secret) as jwt.JwtPayload;
  }

  // ES256 / RS256 — signing keys nuevas, se valida contra el JWKS público.
  if (!header.kid) {
    throw new Error('Token sin "kid", no se puede buscar la clave pública en el JWKS');
  }
  const signingKey = await getJwksClient().getSigningKey(header.kid);
  return jwt.verify(token, signingKey.getPublicKey(), {
    algorithms: [header.alg as jwt.Algorithm],
  }) as jwt.JwtPayload;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader: string | undefined = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta el token de autenticación (header Authorization: Bearer ...)');
    }

    const token = authHeader.slice('Bearer '.length).trim();

    try {
      const payload = await verificarToken(token);
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
