export interface AgendamentoAula {
  agendamentoAulaId: number
  usuarioNome: string
  salaId: number,
  salaNome: string
  disciplinaId: number
  disciplinaNome: string
  semestre: string
  cursoNome: string
  professorNome: string
  data: string
  diaDaSemana: string
  janelaHorarioId: number,
  horaInicio: string
  horaFim: string
  isEvento: boolean
}
