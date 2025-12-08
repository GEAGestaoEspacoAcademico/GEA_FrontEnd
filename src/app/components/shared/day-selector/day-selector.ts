import type { AfterViewInit } from '@angular/core';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormatUtils } from '../../../utils/format.utils';
import type { AgendamentoAula } from '../../../models/agendamentoAula.model';

/**
 * Define a estrutura de dados para um único dia
 * a ser exibido no seletor.
 */
export interface Day {
  /** Um ID único para o dia (ex: "2025-10-29"). */
  id: string;
  /** O número do dia do mês (ex: "29"). */
  date: string;
  /** A abreviação do dia da semana (ex: "QUA"). */
  dayOfWeek: string;
}

/**
 * Componente de UI para exibir um seletor de dias horizontal
 * e rolável.
 *
 * Exibe os dias de um mês, permite a navegação entre meses
 * e a seleção de um dia específico. Controla fades
 * (gradientes) nas laterais para indicar a
 * possibilidade de rolagem.
 * @usage
 * <app-day-selector
 * [currentMonthName]="'Outubro'"
 * [days]="listaDeDias"
 * [activeDayId]="diaAtivoId"
 * (monthChange)="onMudarMes($event)"
 * (dayChange)="onMudarDia($event)"
 * ></app-day-selector>
 */
@Component({
  selector: 'app-day-selector',
  standalone: false,
  templateUrl: './day-selector.html',
  styleUrl: './day-selector.css',
})
export class DaySelector implements AfterViewInit {
  /** Referência ao elemento host do componente injetado. */
  private el = inject(ElementRef);

  /** O nome do mês atual a ser exibido (ex: "Outubro"). */
  @Input() currentMonthName!: string;

  @Input() diasSelecionados: AgendamentoAula[] = [];

  /** O array de objetos Day a ser renderizado no seletor. */
  @Input() days!: Day[];

  /** O ID do dia que deve ser marcado como 'ativo'. */
  @Input() activeDayId!: string | number;

  /** Emitido quando o usuário clica nas setas "anterior" ou "próximo". Emite a direção. */
  @Output() monthChange = new EventEmitter<'previous' | 'next'>();

  /** Emitido quando o usuário clica em um dia. Emite o ID do dia selecionado. */
  @Output() dayChange = new EventEmitter<string | number>();

  /** Referência ao container rolável de dias no template. */
  @ViewChild('daySelector') daySelectorRef!: ElementRef<HTMLElement>;

  /** Flag booleana para controlar a exibição do gradiente esquerdo (fade). */
  public showLeftFade = false;

  /** Flag booleana para controlar a exibição do gradiente direito (fade). */
  public showRightFade = true;

  /** Armazena o ID formatado do dia atual (hoje), usado para o scroll inicial. */
  public currentDay: string = FormatUtils.toId(new Date());

  /**
   * Gancho de ciclo de vida. Chamado após a view ser inicializada.
   * Usa um setTimeout para garantir que o DOM esteja renderizado antes de
   * rolar para o dia de hoje e verificar o estado inicial do scroll.
   */
  ngAfterViewInit(): void {
    // setTimeout(..., 0) espera o próximo ciclo de detecção de
    // mudanças para garantir que o 'daySelectorRef' esteja disponível.
    setTimeout(() => {
      this.scrollToToday();
      this.checkScroll();
    }, 0);
  }

  /**
   * (Privado) Encontra o dia ativo no container e rola suavemente
   * para centralizá-lo na tela.
   *
   *  Isso só acontece se o dia ativo (`activeDayId`) for
   * também o dia de hoje (`currentDay`).
   */
  private scrollToToday(): void {
    const container = this.daySelectorRef?.nativeElement;
    if (!container) {
      return;
    }

    const activeElement = container.querySelector('.day-item.active') as HTMLElement;

    if (activeElement && this.activeDayId === this.currentDay) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }

  /**
   * (Público - Template) Chamado quando um dia é clicado.
   * Emite o evento 'dayChange' se o dia clicado não for
   * o dia que já está ativo.
   * @param id O ID do dia que foi clicado.
   */
  public selectDay(id: string | number): void {
    if (id !== this.activeDayId) {
      this.dayChange.emit(id);
    }
  }

  /**
   * (Público - Template) Chamado pelos botões de navegação de mês.
   * Emite o evento 'monthChange' com a direção ('previous' ou 'next').
   * @param direction A direção da navegação.
   */
  public navigateMonth(direction: 'previous' | 'next'): void {
    this.monthChange.emit(direction);
  }

  /**
   * (Público - Template) Manipulador de evento de rolagem (scroll) do container.
   * Chama checkScroll() para atualizar os fades laterais.
   * @param event O evento de scroll do DOM.
   */
  public onScroll(event: Event): void {
    this.checkScroll(event.target as HTMLElement);
  }

  /**
   * (Privado) Verifica a posição do scroll no container para determinar
   * se os fades (esquerdo/direito) devem ser exibidos.
   * @param element Opcional. O elemento HTML que está rolando.
   * Se não for fornecido, busca o elemento no DOM.
   */
  private checkScroll(element?: HTMLElement): void {
    const el = element || this.el.nativeElement.querySelector('.day-selector');
    if (!el) {
      return;
    }

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const tolerance = 1;
    this.showLeftFade = scrollLeft > tolerance;
    this.showRightFade = scrollLeft + clientWidth < scrollWidth - tolerance;
  }

  temAgendamento(dia: Day): boolean {
    return this.diasSelecionados.some((agendamento) => {
      return agendamento.data === dia.id;
    });
  }
}
