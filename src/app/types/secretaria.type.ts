export interface CriarSecretariaRequest {
  nome: string;
  email: string;
  matricula: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AtualizarSecretariaResquest extends CriarSecretariaRequest {}
