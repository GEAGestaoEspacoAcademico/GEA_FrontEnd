import type { Agendamento } from './agendamento.model';

export interface JanelaHorario {
  janelasHorarioId: number;
  horaInicio: string;
  horaFim: string;
}

export interface SlotHorario {
  horarioExibicao: string;
  horarioComparacao: string;
  agendamento?: Agendamento;
}

export interface Datas {
  datas: string[];
  salaId: number | null;
}
