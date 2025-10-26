import { inject } from '@angular/core';
import type {
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import type { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notificacoes/notification.service';

export const globalErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('ERRO INTERCEPTADO PELA API:', error);
      let userMessage = 'Algo deu errado. Tente novamente mais tarde.';
      const showErrorToast = true;

      switch (error.status) {
        case 0:
          userMessage = 'Sem conexão. Verifique sua internet e tente novamente.';
          break;
        case 403:
          userMessage = 'Acesso negado. Redirecionando para o login...';
          router.navigate(['/login']);
          break;
        case 404:
          userMessage = 'Recurso não encontrado (404).';
          break;
        case 422: {
          const apiErrorMessage = error.error?.message || 'Os dados enviados são inválidos.';
          userMessage = `Erro de validação: ${apiErrorMessage}`;
          break;
        }
        case 500:
        case 503:
          userMessage = 'Erro no servidor. Tente novamente mais tarde.';
          break;
        default:
          userMessage = `Erro inesperado (Código: ${error.status}). Tente novamente.`;
      }

      if (showErrorToast) {
        notificationService.showError(userMessage);
      }

      return throwError(() => new Error(userMessage));
    }),
  );
};
