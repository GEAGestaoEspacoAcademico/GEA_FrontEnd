export interface Agendamento {
    id: 0,
    nomeUsuario: string,
    nomeSala: string,
    disciplinaId: 0,
    nomeDisciplina: string,
    semestre: string,
    curso: string,
    nomeProfessor: string,
    dataInicio: string,
    dataFim: string,
    diaDaSemana: string,
    horaInicio: string,
    horaFim: string,
    tipo: string
}

export interface EditAgendamento{
  salaId: number,
  disciplinaId: number,
  dataInicio: string,
  dataFim: string,
  diaDaSemana: string,
  horaInicio: string,
  horaFim: string,
}