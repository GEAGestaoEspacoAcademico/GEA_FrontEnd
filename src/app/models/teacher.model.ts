  export interface Teacher{
    nome: string,
    disciplinas: string[],
    cursos: Curso[],
  }

  interface Curso{
    semestre: string,
    curso: string,
    disciplina: string
  }