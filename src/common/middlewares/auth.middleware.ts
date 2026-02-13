import { Injectable, NestMiddleware, InternalServerErrorException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

interface InterfaceJWTTokenDecode {
  sub: string;
  token_use: string;
  auth_time: number;
  name?: string;
  email?: string;

  'custom:idUser'?: string;
  'custom:role'?: string;

  exp: number;
}

declare module 'express' {
  interface Request {
    idUser?: number;
    cognitoId?: string;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private decodeJWTToken(token: string): InterfaceJWTTokenDecode {
    return jwtDecode<InterfaceJWTTokenDecode>(token);
  }

  private async getUserById(idUser: number): Promise<void> {
    const urlBase = process.env.URL_BASE_REQUEST_GET_USER_BY_ID;

    if (!urlBase) {
      throw new InternalServerErrorException('Server configuration error');
    }

    try {
      const url = `${urlBase}/${idUser}`;

      await axios.get(url, {
        headers: {
          'x-internal-skip-auth': 'true',
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError;

      console.error('Error verifying user via HTTP:', axiosError.message);

      throw new Error('User not found in database');
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.replace('Bearer ', '').trim();
    }

    if (req.headers['x-auth-id']) {
      return req.headers['x-auth-id'] as string;
    }

    if (req.method.toUpperCase() === 'GET' && req.query['x-auth-id']) {
      return req.query['x-auth-id'] as string;
    }

    return null;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-internal-skip-auth'] === 'true') {
      return next();
    }

    try {
      const token = this.extractToken(req);

      if (!token) {
        res.status(401).json({
          message: 'Unauthorized: token is required',
        });
        return;
      }
      const info = this.decodeJWTToken(token);

      const cognitoId = info.sub;

      let idUser: number | null = null;

      if (info['custom:idUser']) {
        idUser = Number(info['custom:idUser']);
      }

      if (!cognitoId) {
        res.status(401).json({
          message: 'Unauthorized: invalid token',
        });
        return;
      }
      if (idUser && !isNaN(idUser) && idUser > 0) {
        await this.getUserById(idUser);
      }
      req.idUser = idUser ?? undefined;
      req.cognitoId = cognitoId;

      next();
    } catch (err) {
      console.error('Auth error:', err);

      res.status(500).json({
        message: 'Error processing authentication token',
      });
      return;
    }
  }
}
