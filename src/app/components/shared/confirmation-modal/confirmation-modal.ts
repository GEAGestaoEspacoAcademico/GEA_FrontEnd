import type { TemplateRef } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { RoomData } from '../../../models/room.model';

/**
 * Componente de modal genérico e reutilizável para confirmação,
 * exibição de detalhes ou feedback.
 *
 * Este componente NÃO se abre sozinho. O componente pai precisa
 * obter uma referência a ele (usando @ViewChild) e chamar
 * o método público `open()` para exibi-lo.
 *
 * @usage
 * // ----- No template do componente PAI -----
 * <app-confirmation-modal
 * #meuModalAviso
 * mode="aviso"
 * title="Confirmar Ação"
 * message="Você tem certeza que deseja fazer isso?"
 * confirmText="Sim, tenho certeza"
 * (onConfirm)="fazerAcao()"
 * (onCancel)="fecharModal()"
 * ></app-confirmation-modal>
 *
 * // ----- No TS do componente PAI -----
 * import { ViewChild } from '@angular/core';
 * import { ConfirmationModal } from '...';
 *
 * @ViewChild('meuModalAviso') modalAviso!: ConfirmationModal;
 *
 * public solicitarConfirmacao(): void {
 * // Abre o modal
 * this.modalAviso.open();
 * }
 *
 * public fazerAcao(): void {
 * console.log('Ação confirmada!');
 * }
 *
 * public fecharModal(): void {
 * console.log('Modal cancelado.');
 * }
 */
@Component({
  selector: 'app-confirmation-modal',
  standalone: false,
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css',
})
export class ConfirmationModal {
  /** Serviço do Ng-Bootstrap para controlar a instância do modal. */
  private modalService = inject(NgbModal);

  /**
   * Define o modo de operação do modal.
   * - `aviso`: Mostra mensagem, botões de confirmar/cancelar.
   * - `detalhes`: Mostra os dados de `detailsData`.
   * - `feedback`: Mostra apenas uma mensagem e um botão
   */
  @Input({ required: true }) mode: 'aviso' | 'detalhes' | 'feedback' = 'aviso';

  /** O texto a ser exibido no cabeçalho (header) do modal. */
  @Input({ required: true }) title!: string;

  /** (Opcional) A mensagem principal a ser exibida no corpo do modal (modos 'aviso' e 'feedback'). */
  @Input() message!: string;

  /** (Opcional) Os dados da sala para serem exibidos no modo 'detalhes'. */
  @Input() detailsData!: RoomData;

  /** (Opcional) Texto customizado para o botão de confirmação (default: 'Confirmar'). */
  @Input() confirmText: string = 'Confirmar';

  /** (Opcional) Texto customizado para o botão de cancelar/fechar (default: 'Cancelar'). */
  @Input() cancelText: string = 'Cancelar';

  /** (Opcional) Um link de roteador (routerLink) para ser usado por um botão no template. */
  @Input() routerLink: string = ' ';

  /**
   * Evento emitido quando o usuário clica no botão de confirmação.
   *
   */
  @Output() onconfirm = new EventEmitter<void>();

  /** Evento emitido quando o usuário clica em 'Cancelar' ou fecha o modal. */
  @Output() oncancel = new EventEmitter<void>();

  /** Referência interna ao <ng-template> que define o modal no HTML. */
  @ViewChild('ConfirmationModal')
  modalTemplate!: TemplateRef<ConfirmationModal>;

  /**
   * Método PÚBLICO. Deve ser chamado pelo componente pai para abrir o modal.
   * @example
   * // No componente pai:
   * this.meuModal.open();
   */
  public open(): void {
    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
      size: 'sm',
    });
  }

  /**
   * Método interno (chamado pelo template) ao clicar em 'Confirmar'.
   * Emite o evento 'onConfirm' e fecha todos os modais.
   */
  public onModalConfirm(): void {
    this.onconfirm.emit();
    this.modalService.dismissAll();
  }

  /**
   * Método interno (chamado pelo template) ao clicar em 'Cancelar' ou fechar.
   * Emite o evento 'onCancel' e fecha todos os modais.
   */
  public onModalClose(): void {
    this.oncancel.emit();
    this.modalService.dismissAll();
  }
}