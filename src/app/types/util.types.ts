import type { CriarSalaRequest, RecursoAdiconarSala} from "./sala.type";

export interface CriarSalaFormulario extends CriarSalaRequest {
  equipamentos: RecursoAdiconarSala[]
}

export interface CriarAgendamentoAulaFormulario {
  inicio: string,
  fim: string,
  local: number,
  disciplina: number,
  solicitante: string,
  date: string
}

export interface AtulizarUsuarioFormulario {
  usuarioId: number;
  nome: string;
  email: string;
  registro: number;
  cargoId: number;
}
