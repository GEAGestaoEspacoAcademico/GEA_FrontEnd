import type { AgendamentoAula } from "../models/agendamentoAula.model";

///agendamentos/aulas/{agendamentoAulaId}
export interface AgendamentoAulaEditarRequest{
  usuarioId: number,
  salaId: number,
  disciplinaId: number,
  quantidade: number,
  data: string,
  janelasHorarioId: number,
  isEvento: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AgendamentoAulaEditarReponse extends AgendamentoAula {
  //DESABILITADO O ESLINT PARA QUE POSSA DEIXAR AQUI VAZIO, A FIM DE EXPANSÃO FUTURA
}

///agendamentos/aulas
export interface AgendamentoAulaCriarRequest {
  usuarioId: number,
  salaId: number,
  disciplinaId: number,
  quantidade: number,
  data: string,
  janelasHorarioId: number,
  isEvento: boolean
}

///agendamentos/aulas/auxiliar-docente
export interface AgendamentoAulaCriarADRequest {
  usuarioId: number,
  salaId: number,
  disciplinaId: number,
  data: string,
  horaInicio: string,
  horaFim: string,
  solicitante: string
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AgendamentoAulaCriarADReponse extends AgendamentoAula{
  //DESABILITADO O ESLINT PARA QUE POSSA DEIXAR AQUI VAZIO, A FIM DE EXPANSÃO FUTURA
}
export interface AgendamentoData {
  agendamentoId: number,
  sala: [
    salaId: number,
    salaNome: string
  ],
  data: string,
  horaInicio: string,
  horaFim: string,
  disciplinaId: number,
  disciplinaNome: string,
  isEvento: boolean
}

