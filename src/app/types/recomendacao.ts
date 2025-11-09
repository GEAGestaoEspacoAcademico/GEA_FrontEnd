export interface RecomendacaoRequest {
  horarios: Horario,
  data: string //aaaa-mm-dd
  tipoSalaId: number
  recursosIds: number[],
  capacidade: number
}

export interface SalasRecomendadas {
  id: number,
  nome: string,
  capacidade: number,
  piso: number,

}

interface Horario {
  horaInicio: string,
  horaFim: string
}

export interface Recomendacoes {
  id: number,
  nome: string,
  capacidade: number,
  piso: number,
  disponibilidade: boolean,
  tipoSala: string
}