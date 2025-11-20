// /recursos/{recursoId}
export interface AtualizarRecursoRequest {
  recursoNome: string,
  recursoTipoId: number
}

export interface CriarRecursoRequest {
  recursoNome: string,
  recursoTipoId: number
}