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
import { SnackBarService } from '../../services/snackbar/snackbar.service';

/**
 * Interceptor HTTP funcional (`HttpInterceptorFn`) para
 * tratamento global de erros.
 *
 * Este interceptor captura *todas* as respostas de erro HTTP
 * (HttpErrorResponse) da aplicação, exibe uma notificação amigável
 * para o usuário (via NotificationService) e, em casos específicos
 * (como 403), redireciona para a tela de login.
 *
 * @usage
 * // Para registrá-lo globalmente, adicione-o aos providers
 * // no seu `app.config.ts`:
 *
 * export const appConfig: ApplicationConfig = {
 * providers: [
 * provideHttpClient(withInterceptors([globalErrorInterceptor])) // <-- Registra aqui
 * ]
 * };
 *
 * @param request A requisição HTTP original que está sendo interceptada.
 * @param next O próximo manipulador (handler) na cadeia de interceptores.
 * @returns Um Observable<HttpEvent<unknown>>.
 */
export const globalErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const notificationService = inject(SnackBarService);

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