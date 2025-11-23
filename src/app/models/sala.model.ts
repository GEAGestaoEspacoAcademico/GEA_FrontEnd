import type { TIPOSALA } from "./enums/tipoSala.enum";

export interface Sala {
  salaId: number,
  salaNome: string,
  capacidade: number,
  piso: number,
  disponibilidade: boolean,
  tipoSalaId: number,
  tipoSala: string,
  salaObservacoes: string
}
