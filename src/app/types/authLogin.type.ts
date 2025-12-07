export interface AuthLoginRequest {
  usuarioLogin: string;
  usuarioSenha: string;
}

export interface AuthLoginResponse {
  usuarioId: number;
  usuarioNome: string;
  usuarioCargo: string;
}
