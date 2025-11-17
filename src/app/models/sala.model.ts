/**
 * Define a estrutura de dados completo de uma Sala
 */
export interface Sala{
  /** identificador único da sala */
  salaId: number,
  /** Nome da sala (ex: Sala 5, Sala 7) */
  salaNome: string,
  /** Capacidade que a sala possui (ex: 40) */
  capacidade: number,

  piso: number,
  /** Status da sala, se esta disponível ou não (ex: false) */
  disponibilidade: boolean

  tipoSala: string,

  observacoes: string
}