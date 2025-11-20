import type { TIPOSALA } from "./enums/tipoSala.enum";

export interface Sala {
  salaId: 1,
  salaNome: string,
  capacidade: number,
  piso: number,
  disponibilidade: boolean,
  tipoSala: TIPOSALA,
  salaObservacoes: string
}