/**
 * Define a estrutura de dados completo de uma Disciplina
 */
export interface Disciplina{
  /** Identificador único da Disciplina */
  idDisciplina: number,
  /** Nome da disciplina  (ex: "Calculo 1") */
  nomeDisciplina: string,
  /** Disciplina relacionado à Disciplina(ex: "2025.2")*/
  semestre: string,
  /** Nome do professor que ministra a Disciplina  (ex: "Cláudio")*/
  professor: string,
  /** Nome do Curso em que a disciplina é ministrada (ex: "Análise e Desenvolvimento de Sistemas")*/
  nomeCurso: string
}