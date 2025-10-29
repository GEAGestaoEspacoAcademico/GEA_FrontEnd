/**
 * Define a estrutura de dados completo de uma Sala
 */
export interface Sala{
  /** identificador único da sala */
  id: number,
  /** Nome da sala (ex: Sala 5, Sala 7) */
  nome: string,
  /** Capacidade que a sala possui (ex: 40) */
  capacidade: number,
  /** Status da sala, se esta disponível ou não (ex: false) */
  disponibilidade: boolean
}