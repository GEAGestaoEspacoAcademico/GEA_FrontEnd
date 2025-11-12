/**
 * Define a estrutura de dados completo do usuário
 */
export interface User{
  /** Identificador único do usuário */
  usuarioId: number,
  /** Nome do usuário logado (ex: "Isaque") */
  usuarioNome: string,
  /** Cargo do usuário, para autenticações (ex: "PROFESSOR") */
  usuarioCargo: string
}
