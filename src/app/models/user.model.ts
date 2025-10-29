/**
 * Define a estrutura de dados completo do usuário
 */
export interface User{
  /** Identificador único do usuário */
  id: number,
  /** Nome do usuário logado (ex: "Isaque") */
  nome: string,
  /** Cargo do usuário, para autenticações (ex: "PROFESSOR") */
  cargo: string
}
