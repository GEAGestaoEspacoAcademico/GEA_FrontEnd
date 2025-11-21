///disciplinas/{disciplinaId}
export interface AtualizarDisciplinaRequest {
  cursoId: number,
  disciplinaNome: string,
  disciplinaSemestre: string
}

///disciplinas
export interface CriarDisciplinaRequest {
  cursoId: number,
  disciplinaNome: string,
  disciplinaSemestre: string
}

//!Caso no final do desenvolvimento, elas continuem iguais, simplificar para apenas uma interface