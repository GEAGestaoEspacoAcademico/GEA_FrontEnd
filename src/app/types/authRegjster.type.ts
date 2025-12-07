export interface AuthRegisterRequest {
  usuarioLogin: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioSenha: string;
}

export interface AuthRegisterResponse {
  usuarioId: number;
  usuarioNome: string;
  usuarioEmail: string;
  cargoId: number;
}
