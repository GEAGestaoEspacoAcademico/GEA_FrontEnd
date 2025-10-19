import { Component, inject } from '@angular/core';
import { IconRegistryService } from './services/iconService/icon-registry';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
})
export class App {
  private iconRegistryService = inject(IconRegistryService);
  constructor() {
    this.iconRegistryService.registerIcons();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSchedule(event: any) {
    console.log('Agendamento confirmado:', event);
  }

}
