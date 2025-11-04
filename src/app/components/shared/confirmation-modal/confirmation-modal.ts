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
   */
  @Output() onconfirm = new EventEmitter<void>();

  /** Evento emitido quando o usuário clica em 'Cancelar' ou fecha o modal. */
  @Output() oncancel = new EventEmitter<void>();

  /** Referência interna ao <ng-template> que define o modal no HTML. */
  @ViewChild('ConfirmationModal')
  modalTemplate!: TemplateRef<ConfirmationModal>;

  /**
   * Método PÚBLICO. Deve ser chamado pelo componente pai para abrir o modal.
   * @returns {void}
   */
  public open(): void {
    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
      size: 'sm',
    });
  }

  /**
   * Chamado pelo template ao confirmar.
   * Emite o evento e fecha o modal.
   * @returns {void}
   */
  public onModalConfirm(): void {
    this.onconfirm.emit();
    this.modalService.dismissAll();
  }

  /**
   * Chamado pelo template ao cancelar/fechar.
   * Emite o evento e fecha o modal.
   * @returns {void}
   */
  public onModalClose(): void {
    this.oncancel.emit();
    this.modalService.dismissAll();
  }

  /**
   * Quantidade de aulas inferida a partir de detailsData.
   * - Tenta encontrar "X aulas" nas observações.
   * - Se não encontrar, tenta inferir a partir do campo `horario` contando ranges.
   * - Retorna null se não foi possível inferir.
   */
  get qtdAulas(): number | null {
    if (!this.detailsData) {
      return null;
    }

    const obs: string[] = this.detailsData.observacoes ?? [];
    for (const o of obs) {
      const m = /(\d+)\s*(?:aulas?|aula|qty|qtd)/i.exec(o);
      if (m && m[1]) {
        const n = Number(m[1]);
        if (!Number.isNaN(n)) {
          return n;
        }
      }
      const m2 = /(?:qtd[:\s]*|aulas?[:\s]*)(\d+)/i.exec(o);
      if (m2 && m2[1]) {
        const n2 = Number(m2[1]);
        if (!Number.isNaN(n2)) {
          return n2;
        }
      }
    }

    if (this.detailsData.horario) {
      const horario = String(this.detailsData.horario);
      const segments = horario.split(/[,;/]+/).map(s => s.trim()).filter(Boolean);
      if (segments.length > 1) {
        return segments.length;
      }
      if (segments.length === 1) {
        return 1;
      }
    }
    return null;
  }

  /**
   * Retorna uma lista de equipamentos extraída das observações.
   * Heurística:
   * - Procura por linhas que mencionem palavras-chave típicas de equipamento.
   */
  get equipamentos(): string[] {
    if (!this.detailsData) {
      return [];
    }

    const obs: string[] = this.detailsData.observacoes ?? [];
    const keywords = [
      'projetor', 'projetor multimídia', 'projeção', 'quadro branco', 'quadro',
      'microfone', 'som', 'caixas', 'caixa de som', 'tv', 'televisão',
      'monitor', 'computador', 'pc', 'notebook', 'câmera', 'webcam',
      'cadeiras', 'mesas', 'bancadas', 'tomada', 'equipamento'
    ];

    const found: Set<string> = new Set<string>();

    for (const o of obs) {
      const lower = o.toLowerCase();
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          const partsAfterColon = o.split(/[:\-–—]/);
          const relevant = partsAfterColon.length > 1 ? partsAfterColon.slice(1).join(':') : o;
          const candidates = relevant.split(',').map(s => s.trim()).filter(Boolean);
          for (const c of candidates) {
            const short = c.length > 0 ? c : o;
            found.add(short);
          }
          break;
        }
      }
    }

    if (found.size === 0 && obs.length > 0) {
      for (const o of obs) {
        if (o.includes(',')) {
          const candidates = o.split(',').map(s => s.trim()).filter(Boolean);
          for (const c of candidates) {
            if (c.length > 2 && c.length < 100) {
              found.add(c);
            }
          }
          if (found.size > 0) {
            break;
          }
        }
      }
    }

    return Array.from(found).map(s => this.capitalizeEquipmentLabel(s));
  }

  /**
   * Observações complementares (que não foram classificadas como equipamentos).
   */
  get observacoesComplementares(): string[] {
    if (!this.detailsData) {
      return [];
    }

    const obs: string[] = this.detailsData.observacoes ?? [];
    const equipSet = new Set(this.equipamentos.map(e => e.toLowerCase()));
    const rest: string[] = [];

    for (const o of obs) {
      const normalized = o.trim();
      const containsEquipment = Array.from(equipSet).some(eq => normalized.toLowerCase().includes(eq));
      if (!containsEquipment) {
        rest.push(normalized);
      }
    }
    return rest;
  }

  /**
   * Monta um array de pares label/value para facilitar a renderização no template
   * modo 'detalhes'. O template pode iterar sobre detailsPairs para exibir linhas.
   */
  get detailsPairs(): Array<{ label: string; value: string | number | string[] | null }>  {
    if (!this.detailsData) {
      return [];
    }

    const pairs: Array<{ label: string; value: string | number | string[] | null }> = [];

    pairs.push({ label: 'Nome', value: this.detailsData.nome ?? '' });
    pairs.push({ label: 'Data', value: this.detailsData.data ?? '' });
    pairs.push({ label: 'Horário', value: this.detailsData.horario ?? '' });
    pairs.push({ label: 'Capacidade', value: this.detailsData.capacidade ?? '' });

    const qtd = this.qtdAulas;
    if (qtd !== null) {
      pairs.push({ label: 'Qtd aulas', value: qtd });
    }
    const eqs = this.equipamentos;
    if (eqs.length) {
      pairs.push({ label: 'Equipamentos', value: eqs });
    }

    const obs = this.observacoesComplementares;
    if (obs.length) {
      pairs.push({ label: 'Observações', value: obs });
    }

    return pairs;
  }

  private capitalizeEquipmentLabel(s: string): string {
    const trimmed = s.trim();
    const cleaned = trimmed.replace(/\.$/, '');
    return cleaned.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
}