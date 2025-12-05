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
 * @usage
 * // Para registrá-lo globalmente, adicione-o aos providers
 * // no seu `app.config.ts`:
 *
 * export const appConfig: ApplicationConfig = {
 * providers: [
 * provideHttpClient(withInterceptors([globalErrorInterceptor])) // <-- Registra aqui
 * ]
 * };
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
      const userMessage = error.error.message;
      const showErrorToast = true;
      

      if (showErrorToast) {
        notificationService.showError(userMessage);
      }

      return throwError(() => new Error(userMessage));
    }),
  );
};