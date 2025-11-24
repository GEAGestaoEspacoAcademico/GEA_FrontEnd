export interface GetUsuarioResponse {
  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string;
  cargoId: number;
}

export interface AtualizarUsuarioAdminResquest {
  usuarioNome: string;
  usuarioEmail: string;
  cargoId: number;
}

export interface AlterarSenhaUsuarioRequest {
  senhaAtual: string;
  novaSenha: string;
  repetirNovaSenha: string;
}

export interface UsuarioComNomeCargo extends GetUsuarioResponse{
  nomeCargo: string,
}
