export interface AuxiliarDocente {
  id: number;
  nome: string;
  email: string;
  area: string;
}

export type CriarAuxiliarDocenteRequest = Omit<AuxiliarDocente, 'id'>;