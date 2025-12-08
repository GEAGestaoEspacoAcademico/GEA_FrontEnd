///agendamentos/eventos
interface DiaEvento {
  dia: string;
  horaInicio: string;
  horaFim: string;
}

export interface CriarEventoRequest {
  usuarioId: number;
  eventoNome: string;
  salaId: number;
  dias: DiaEvento[];
}

export type CriarEventoFormulario = Omit<CriarEventoRequest, 'usuarioId'>;
