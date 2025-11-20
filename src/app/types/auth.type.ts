
//PATCH /usuarios/{usuarioId}
export interface AtualizarUsuarioRequest {
  usuarioNome: string,
  usuarioEmail: string,
  cargoId: 0
}

//PATCH /usuarios/{usuarioId}/senha
export interface AlterarSenhaUsuarioRequest {
  senhaAtual: string,
  novaSenha: string,
  repetirNovaSenha: string
}