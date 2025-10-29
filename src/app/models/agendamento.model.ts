export interface Agendamento {
    /**Identificador único do agendamento */
    id: 0,
    /* Nome do usuário que fez a ação no agendamento */
    nomeUsuario: string,
    /* Nome da sala em que o agendamento está atrelado */
    nomeSala: string,
    /*Id número da disciplina associada ao agendamento */
    disciplinaId: 0,
    /*Nome da disciplina associada ao agendamento */
    nomeDisciplina: string,
    /*Semestre relacionado ao agendamento */
    semestre: string,
    /*Nome do curso do agendamento */
    curso: string,
    /*Nome do professor que realizará o agendamento */
    nomeProfessor: string,
    /*Data em que a aula irá começar */
    dataInicio: string,
    /*Data em que a aula irá acabar */
    dataFim: string,
    /*Dia da semana em que a aula irá ocorrer */
    diaDaSemana: string,
    /*Horario de Inicio que a aula irá ocorrer */
    horaInicio: string,
    /*Horario de fim que a aula irá ocorrer */
    horaFim: string,
    /*Tipos do agendamento */
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