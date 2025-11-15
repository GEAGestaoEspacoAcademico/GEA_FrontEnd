// Em src/app/services/icon-registry.service.ts
import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Serviço responsável pelo gerenciamento de icones da aplicação
 */
@Injectable({
  providedIn: 'root',
})
export class IconRegistryService {
  private iconPath = 'assets/icons/';
  private matIconRegistry = inject(MatIconRegistry);
  private domSanitizer = inject(DomSanitizer);

  /**
   * Faz a inserção de todos os icones no projeto
   */
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
    this.addIcon('notification-fill', 'notification-fill.svg');
    this.addIcon('settings', 'settings.svg');
    this.addIcon('user', 'user.svg');
    this.addIcon('logout', 'logout.svg');
    this.addIcon('arrow-back', 'arrow-back.svg');
    this.addIcon('arrow-previus', 'arrow-previus.svg');
    this.addIcon('details-arrow', 'details-arrow.svg');
    this.addIcon('add-circle', 'add-circle.svg');
    this.addIcon('computer', 'computer.svg');
    this.addIcon('home', 'home.svg');
    this.addIcon('tada', 'tada.svg');
    this.addIcon('pencil', 'pencil.svg');
    this.addIcon('trash', 'trash.svg');
  }
  /**
   * Insere um novo icone no projeto
   * @param iconName Nome do icone
   * @param fileName Nome do arquivo do icone
   */
  private addIcon(iconName: string, fileName: string): void {
    this.matIconRegistry.addSvgIcon(
      iconName,
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconPath + fileName),
    );
  }
}
