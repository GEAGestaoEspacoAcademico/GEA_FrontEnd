///janelas-horario/{janelaHorarioId}
export interface AtualizarJanelaHorarioRequest {
  horaInicio: string,
  horaFim: string
}

///janelas-horario
export interface CriarJanelaHorarioRequest {
  horaInicio: string,
  horaFim: string
}

export interface JanelasHorarioPorDataRequest{
  data: string,
  salaId: number,
}
