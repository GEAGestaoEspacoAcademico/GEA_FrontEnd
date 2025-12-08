///disciplinas/{disciplinaId}
export interface AtualizarDisciplinaRequest {
  disciplinaId: number;
  disciplinaNome: string;
  semestreId: number;
  semestreNome: string;
  cursoId: number;
  cursoNome: string;
}

///disciplinas
export interface CriarDisciplinaRequest {
  cursoId: number;
  disciplinaNome: string;
  semestreId: number;
}

//!Caso no final do desenvolvimento, elas continuem iguais, simplificar para apenas uma interface
