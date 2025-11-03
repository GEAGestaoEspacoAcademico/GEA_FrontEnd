import { inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { SnackBarService } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private swPush = inject(SwPush);
  private snackBarService = inject(SnackBarService)
  
  private readonly VAPID_PUBLIC_KEY = ""

  public inscreverNotificacao(): void {
    if(!this.swPush.isEnabled){
      this.snackBarService.showError("Service Worker ou Push Messaging não estão habilitados.")
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(subscription => {
      // TODO: Enviar a 'subscription' (JSON) para o backend.
      console.log('Inscrição Push bem-sucedida:', subscription.toJSON());
    })
  }

  public listenToMessages(): void {
    this.swPush.messages.subscribe(message => {
      console.log('Push message recebida:', message);
      //TODO: Exibir um snack do tipo notificação ou um toast
      this.snackBarService.showSuccess("Menssagem recebida")
    });
  }

  public listenToNotificationClicks(): void {
    this.swPush.notificationClicks.subscribe(event => {
      console.log('Notificação clicada:', event);
      // Ex: Redirecionar o usuário para a página relevante
      // this.router.navigate([event.notification.data.url]);
    });
  }
}
