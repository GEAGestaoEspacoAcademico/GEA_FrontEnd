
// PUT /tipo-recurso/{idTipoRecurso}
export interface AtualizarTipoRecursoRequest {
  nome: string
}

//POST /tipo-recurso
export type CriarTipoRecursoRequest = AtualizarTipoRecursoRequest;
