export interface AgendamentoAula {
  agendamentoAulaId: number
  usuarioNome: string
  salaNome: string
  disciplinaId: number
  disciplinaNome: string
  semestre: string
  cursoNome: string
  professorNome: string
  data: string
  diaDaSemana: string
  horaInicio: string
  horaFim: string
  isEvento: boolean
}