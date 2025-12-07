export interface Sala {
  salaId: number;
  salaNome: string;
}

export interface Agendamento {
  agendamentoId: number;
  sala: Sala;
  data: string;
  horaInicio: string;
  horaFim: string;
  disciplinaId: number;
  disciplinaNome: string;
  isEvento: boolean;
}
