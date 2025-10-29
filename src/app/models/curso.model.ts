/**
 * Define a estrutura de dados completo de um Curso
 */
export interface Curso{
  /** Identificador único do Curso*/
  id: number,
  /** Nom do curso */
  nomeCurso: string,
  /** Nome do coordenador atrelado ao Curso */
  coodernador: string
}