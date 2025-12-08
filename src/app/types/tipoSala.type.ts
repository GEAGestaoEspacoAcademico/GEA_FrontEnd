//PUT /tipos-salas/{idTipoSala}
export interface AtualizarTipoSalaRequest {
  tipoSalaNome: string;
}

//POST /tipos-salas
export type CriarTipoSalaRequest = AtualizarTipoSalaRequest;
