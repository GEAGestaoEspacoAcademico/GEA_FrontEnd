/**
 * Define a estrutura de dados completo de um Curso
 */
export interface Curso{
  /** Identificador único do Curso*/
  cursoId: number,
  /** Nom do curso */
  cursoNome: string,
  /** Nome do coordenador atrelado ao Curso */
  coodernadorId: string,
  /** Sigla do nome do curso */
  cursoSigla: string
}