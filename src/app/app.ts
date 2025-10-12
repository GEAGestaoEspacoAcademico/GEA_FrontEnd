import { Component, inject, isDevMode } from '@angular/core';
import { IconRegistryService } from './services/iconService/icon-registry';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

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
