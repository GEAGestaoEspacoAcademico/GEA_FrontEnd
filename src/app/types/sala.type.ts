import type { Sala } from '../models/sala.model';

interface Horario {
  horaInicio: string;
  horaFim: string;
}

// /salas/{salaId}
export interface AtualizarSalaRequest {
  salaNome: string;
  salaCapacidade: number;
  pisoId: number;
  disponibilidade: boolean;
  tipoSalaId: number;
  salaObservacoes: string;
}

//!O Response do AtulizarSala não é necessária

// /salas/{salaId}/recursos/{recursoId}
export interface AtulizarQuantidadeRecursoSalaRequest {
  quantidade: number;
}

// /salas
export type BuscarSalaResponse = Omit<Sala, 'observacoes'>;

// POST /salas
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CriarSalaRequest extends AtualizarSalaRequest {
  // Eslint desativo a fim de escalar futuramente
}

export interface CriarSalaResponse {
  salaId: number;
  salaNome: string;
  capacidade: number;
  pisoId: number;
  disponibilidade: boolean;
  tipoSala: string;
  observacoes: string;
}

// GET /salas/{salaId}/recursos
export interface BuscarRecursoSalaResponse {
  idRecurso: number;
  nome: string;
  tipo: string;
  quantidade: number;
}

// GET /salas/{salaId}/recursos
export interface BuscarRecursoSalaResponseArray {
  idRecurso: number;
  nomeRecurso: string;
  tipoRecurso: string;
  quantidadeRecurso: number;
}

// POST /salas/{salaId}/recursos

export interface RecursoAdiconarSala {
  recursoId: number;
  quantidadeRecurso: number;
}
export interface AdicionarRecursoSalaRequest {
  listaDeRecursosParaAdicionar: RecursoAdiconarSala[];
}

//! Sujeito a mudanças
export interface AdicionarRecursoSalaResponse {
  idRecurso: number;
  nome: string;
  tipo: string;
  quantidade: number;
}

// POST /salas/recomendacoes
export interface BuscarRecomendacaoRequest {
  horarios: Horario;
  data: string;
  tipoSalaId: number;
  recursosIds: number[];
  capacidade: number;
}

export interface BuscarRecomendacaoResponse {
  recomendacoes: Sala[];
  outrasOpcoes: Sala[];
}

// GET salas/disponíveis
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BuscarSalaDisponivel extends BuscarRecomendacaoResponse {
  //Lint desabilitado a fim de minimizar o códgo
  //!Haverá mudanças
}
