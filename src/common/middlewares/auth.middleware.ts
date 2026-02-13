import { Injectable, NestMiddleware, InternalServerErrorException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

interface InterfaceJWTTokenDecode {
  token_use: string;
  auth_time: number;
  name: string;
  'custom:idUser': string;
  exp: number;
  'custom:role': string;
}

declare module 'express' {
  interface Request {
    idUser?: number;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private decodeJWTToken(token: string): InterfaceJWTTokenDecode {
    return jwtDecode<InterfaceJWTTokenDecode>(token);
  }

  private async getUserById(idUser: number): Promise<void> {
    const urlBase = process.env.URL_BASE_REQUEST_GET_USER_BY_ID;

    if (!urlBase) throw new InternalServerErrorException('Server configuration error');

    try {
      const url = `${urlBase}/${idUser}`;
      console.log(`Middleware calling internal API: ${url}`);

      await axios.get(url, {
        headers: {
          'x-internal-skip-auth': 'true',
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('Error verifying user via HTTP', axiosError.message);
      throw new Error('User not found in database');
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-internal-skip-auth'] === 'true') {
      console.log('Petición interna detectada: Saltando AuthMiddleware');
      return next();
    }

    try {
      let token: string | null = null;
      if (req.method.toUpperCase() === 'GET' && req.query['x-auth-id']) {
        token = req.query['x-auth-id'] as string;
      } else if (req.headers['x-auth-id']) {
        token = req.headers['x-auth-id'] as string;
      }

      if (!token) {
        res.status(401).json('unauthorized, token is required');
        return;
      }

      const info = this.decodeJWTToken(token);
      const idUser = Number(info['custom:idUser']);

      if (!idUser || idUser <= 0 || isNaN(idUser)) {
        res.status(401).json('Unauthorized, token is not valid');
        return;
      }

      await this.getUserById(idUser);
      console.log(`User verificado via HTTP: ${idUser}`);

      req.idUser = idUser;
      next();
    } catch (err) {
      console.error('Auth error:', err);
      res.status(500).json('Error with processing token in the server - Custom Process');
      return;
    }
  }
}
