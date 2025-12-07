import type { Piso } from './piso';

export interface Sala {
  salaId: number;
  salaNome: string;
  capacidade: number;
  disponibilidade: boolean;
  tipoSalaId: number;
  tipoSala: string;
  pisoId: number;
  piso: Piso;
  salaObservacoes: string;
}
