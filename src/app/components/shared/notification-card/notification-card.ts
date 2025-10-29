import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Componente de card para exibir uma
 * única notificação em uma lista.
 *
 * Este é um "Dumb Component", otimizado com
 * `ChangeDetectionStrategy.OnPush`. Ele não possui lógica
 * interna e apenas exibe os dados recebidos via @Input.
 *
 * @usage
 * <app-notification-card
 * [source]="notificacao.origem"
 * [title]="notificacao.titulo"
 * [date]="notificacao.dataEnvio"
 * [snippet]="notificacao.resumo"
 * ></app-notification-card>
 */
@Component({
  selector: 'app-notification-card',
  standalone: false,
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.css',
  /**
   * OnPush: O componente só será verificado
   * quando suas propriedades @Input mudarem,
   * melhorando a performance.
   */
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationCard {
  /** A origem da notificação (ex: "Biblioteca", "Sistema Acadêmico"). */
  @Input() source!: string;

  /** O título principal da notificação. */
  @Input() title!: string;

  /** A data e hora em que a notificação foi enviada. */
  @Input() date!: Date | string;

  /** Um breve resumo ou trecho da mensagem da notificação. */
  @Input() snippet!: string;
}