interface Dia {
  dia: string,
  horarioInicio: string,
  horaFim: string
}
///agendamentos/eventos
export interface CriarAgendamentoEventoRequest {
  usuarioId: number,
  eventoNome: string,
  salaId: number,
  dias: Dia[]
}