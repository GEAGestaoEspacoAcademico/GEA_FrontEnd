///cursos
export interface CriarCursoRequest {
  cursoNome: string,
  coordenadorId: number,
  cursoSigla: string
}

export type AtualizarCursoRequest = CriarCursoRequest;