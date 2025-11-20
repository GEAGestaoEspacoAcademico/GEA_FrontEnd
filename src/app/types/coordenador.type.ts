///coordenadores
export interface CriarCoordenadorRequest {
  coordenadorUsuarioId: number,
  registroCoordenacao: number
}

export interface CriarCoordenadorResponse {
  coordenadorUsuarioId: number,
  coordenadorNome: string,
  coordenadorEmail: string,
  registroCoordenacao: number,
  cargoId: number
}
