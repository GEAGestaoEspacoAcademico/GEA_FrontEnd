export interface AgendarForm {
  data: string;
  qtdAulas: string;
  janelaHorarioId: number;
  cursoId: string;
  disciplinaId: string;
  localId: string;
  capacidade: string;
  recursos: recursoOption[];
}

interface recursoOption {
  id: number;
  label: string;
  quantity: number;
}

export interface CriarAgendamento {
  usuarioId: number;
  salaId: number;
  disciplinaId: number;
  dataInicio: string;
  dataFim: string;
  diaDaSemana: string;
  janelasHorarioId: number;
  tipo: string;
}
