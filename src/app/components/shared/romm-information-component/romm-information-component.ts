import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { RoomData } from '../../../models/room.model';

/**
 * Componente de apresentação (dumb component) responsável por
 * exibir as informações de uma sala (RoomData) e fornecer
 * um gatilho para confirmar um agendamento.
 *
 * @usage
 * <app-romm-information-component
 * [labData]="dadosDaMinhaSala"
 * (ConfirmSchedule)="onConfirmar($event)"
 * ></app-romm-information-component>
 */
@Component({
  selector: 'app-romm-information-component',
  standalone: false,
  templateUrl: './romm-information-component.html',
  styleUrl: './romm-information-component.css'
})
export class RommInformationComponent {
  /**
   * Os dados da sala/laboratório (RoomData) que serão
   * exibidos neste componente.
   */
  @Input() labData!: RoomData;

  /**
   * Evento emitido quando o usuário executa a ação de confirmação
   * Emite o ID (número) da sala.
   */
  @Output() ConfirmSchedule = new EventEmitter<number>();

  /**
   * Método público, destinado a ser chamado pelo template (ex: (click)),
   * que dispara o evento 'ConfirmSchedule' com o ID da sala.
   */
  public execute(): void {
    this.ConfirmSchedule.emit(this.labData.id);
  }
}