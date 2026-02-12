import { Logger } from 'winston';
import { AxiosError } from 'axios';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export abstract class BaseHttpClient {
  protected constructor(protected readonly logger: Logger) {}

  /**
   * Método genérico para ejecutar peticiones HTTP de forma segura.
   * @param requestPromise La promesa de la petición
   * @param context Objeto con datos para el log
   * @param errorMessage Mensaje personalizado si falla todo
   */
  protected async safeRequest<T>(
    requestPromise: Promise<{ data: T }>,
    context: Record<string, any> = {},
    errorMessage = 'Error en comunicación con microservicio externo',
  ): Promise<T> {
    try {
      const { data } = await requestPromise;
      return data;
    } catch (error) {
      this.handleError(error, context, errorMessage);
    }
  }

  private handleError(error: unknown, context: Record<string, any>, defaultMessage: string): never {
    if (error instanceof AxiosError) {
      this.logger.error('Error externo (Axios)', {
        ...context,
        message: error.message,
        status: error.response?.status ?? null,
        data: (error.response?.data as unknown) ?? null,
        stack: error.stack,
      });

      if (error.response?.status === 404) {
        throw new NotFoundException(
          `Recurso no encontrado en servicio externo. Contexto: ${JSON.stringify(context)}`,
        );
      }
    } else {
      const genericError = error as Error;
      this.logger.error('Error inesperado en Cliente HTTP', {
        ...context,
        message: genericError.message,
        stack: genericError.stack,
      });
    }
    throw new HttpException(defaultMessage, HttpStatus.FAILED_DEPENDENCY);
  }
}
