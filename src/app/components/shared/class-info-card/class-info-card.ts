import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatUtils } from '../../../utils/format.utils';
import type { Agendamento } from '../../../models/agendamento.model';
import type { AgendamentoAula } from '../../../models/agendamentoAula.model';

/**
 * Componente de card responsável por exibir as informações
 * resumidas de um agendamento e permitir ações (Alterar/Cancelar).
 *
 * É um "Dumb Component" (componente de apresentação), recebendo
 * dados via @Input e emitindo eventos via @Output.
 * @usage
 * <app-class-info-card
 * [agendamentoData]="meuAgendamento"
 * (delete)="onSolicitarCancelamento($event)"
 * (alterar)="onSolicitarAlteracao($event)"
 * ></app-class-info-card>
 */
@Component({
  selector: 'app-class-info-card',
  standalone: false,
  templateUrl: './class-info-card.html',
  styleUrl: './class-info-card.css'
})
export class ClassInfoCard {
  /**
   * Os dados do agendamento a ser exibido.
   * Recebido do componente pai.
   */
  @Input({ required: true }) agendamentoData!: AgendamentoAula;

  /**
   * Evento emitido quando o usuário clica no botão "Cancelar".
   * Emite o ID (número) do agendamento a ser excluído.
   */
  @Output() delete = new EventEmitter<number>();

  /**
   * Evento emitido quando o usuário clica no botão "Alterar".
   * Emite o ID (número) do agendamento a ser alterado/visualizado.
   */
  @Output() alterar = new EventEmitter<number>();

  /**
   * Armazena a data atual formatada.
   * Usado no template para comparações (ex: desabilitar
   * botões de ação para agendamentos que já passaram).
   */
  public currentDate = FormatUtils.toId(new Date());

  /**
   * Manipulador do clique no botão "Cancelar".
   * Emite o evento 'delete' com o ID do agendamento.
   */
  public handleDelete(): void {
    this.delete.emit(this.agendamentoData.agendamentoAulaId);
  }

  /**
   * Manipulador do clique no botão "Alterar".
   * Emite o evento 'alterar' com o ID do agendamento.
   */
  public handleAlterar(): void {
    this.alterar.emit(this.agendamentoData.agendamentoAulaId);
  }
}