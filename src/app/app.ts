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

}
