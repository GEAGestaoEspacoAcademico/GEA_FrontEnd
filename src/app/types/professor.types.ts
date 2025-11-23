import type { Curso } from "../models/curso.model"

///professores/{professorId}
export interface AtualizarProfessorRequest {
  usuarioId: number,
  nome: string,
  email: string,
  cargoId: number,
  disciplinasIds: number[]
}

///professores
export interface CriarProfessorRequest {
  login: string,
  nome: string,
  email: string,
  senha: string,
  registroProfessor: number
}

///professores/{professorId}/cursos
export type BuscarCursosProfessorResponse  = Omit<Curso, 'coordenadorId'>