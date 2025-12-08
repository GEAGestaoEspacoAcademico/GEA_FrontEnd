export interface AgendamentoRecorrente {
  usuarioId: number;
  dataInicio: string;
  dataFim: string;
  diaDaSemana: string;
  janelasHorarioId: number[];
  disciplinaId: number;
  salaId: number;
}
