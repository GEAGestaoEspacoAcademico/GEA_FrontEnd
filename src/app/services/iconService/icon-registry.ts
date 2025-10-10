// Em src/app/services/icon-registry.service.ts
import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconRegistryService {
  private iconPath = 'assets/icons/';
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  registerIcons(): void {
    this.addIcon('ads-icon', 'ads-icon.svg');
    this.addIcon('alert', 'alert.svg');
    this.addIcon('arrow-down', 'arrow-down.svg');
    this.addIcon('calendar', 'calendar.svg');
    this.addIcon('check', 'check.svg');
    this.addIcon('close', 'close.svg');
    this.addIcon('document', 'document.svg');
    this.addIcon('list', 'list.svg');
    this.addIcon('icon-fatec', 'icon-fatec.svg');
    this.addIcon('menu', 'menu.svg');
    this.addIcon('minimize', 'minimize.svg');
    this.addIcon('notification', 'notification.svg');
    this.addIcon('notification-fill', 'notification-fill.svg')
    this.addIcon('settings', 'settings.svg');
    this.addIcon('user', 'user.svg');
  }

  private addIcon(iconName: string, fileName: string): void {
    this.matIconRegistry.addSvgIcon(
      iconName,
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconPath + fileName)
    );
  }
}