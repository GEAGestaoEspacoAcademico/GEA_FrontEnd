export interface Disciplina {
  id?: number;
  nome: string;
}

export interface Espaco {
  id: number;
  nome: string;
  piso?: string;
  tipoDeEspaco?: string;
  disciplinas?: Disciplina[];
  indisponivel?: boolean;
}

/** Payload emitido ao salvar (pode conter id e valores atualizados) */
export interface EspacoEditPayload {
  id: number;
  nome: string;
  piso?: string;
  tipoDeEspaco?: string;
  disciplinas: Disciplina[];
  indisponivel?: boolean;
}