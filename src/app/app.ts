import { Component, inject } from '@angular/core';
import { IconRegistryService } from './services/iconService/icon-registry';
import { PushNotificationService } from './services/push-notification/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
  private iconRegistryService = inject(IconRegistryService);
  private pushNotificationService = inject(PushNotificationService);
  
  constructor() {
    this.iconRegistryService.registerIcons();
    this.pushNotificationService.listenToMessages();
    this.pushNotificationService.listenToNotificationClicks();
    
    this.pushNotificationService.inscreverNotificacao();
  }
}
