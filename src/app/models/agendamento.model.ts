/**
 * Define a estrutura de dados completa de um Agendamento
 * (geralmente usado para leitura/exibição de dados).
 */
export interface Agendamento {
  /** Identificador único do agendamento. */
  id: number;

  /** Nome do usuário que fez a última ação no agendamento. */
  nomeUsuario: string;

  /** Nome da sala em que o agendamento está atrelado. */
  nomeSala: string;

  /** ID numérico da disciplina associada ao agendamento. */
  disciplinaId: number;

  /** Nome da disciplina associada ao agendamento. */
  nomeDisciplina: string;

  /** Semestre relacionado ao agendamento (ex: "2025.2"). */
  semestre: string;

  /** Nome do curso do agendamento. */
  curso: string;

  /** Nome do professor que realizará o agendamento. */
  nomeProfessor: string;

  /** Data e hora em que a aula irá começar. (Recomendado usar Date). */
  dataInicio: Date | string; // Usar Date é melhor, mas string (ISO) é aceitável

  /** Data e hora em que a aula irá acabar. (Recomendado usar Date). */
  dataFim: Date | string;

  /** Dia da semana em que a aula irá ocorrer. */
  diaDaSemana: string; // Usando o Union Type

  /** Horário de início que a aula irá ocorrer (ex: "08:00"). */
  horaInicio: string;

  /** Horário de fim que a aula irá ocorrer (ex: "11:30"). */
  horaFim: string;

  /** Tipo do agendamento (ex: Aula, Evento). */
  tipo: string; // Usando o Enum
}

/**
 * Define a estrutura de dados para criar ou editar um Agendamento
 * (geralmente usado para envio de dados à API - DTO).
 */
export interface EditAgendamento {
  /** ID único da sala. */
  salaId: number;

  /** ID número da disciplina associada ao agendamento. */
  disciplinaId: number;

  /** Data em que a aula irá começar. */
  dataInicio: Date | string;

  /** Data em que a aula irá acabar. */
  dataFim: Date | string;

  /** Dia da semana em que a aula irá ocorrer. */
  diaDaSemana: string;

  /** Horário de início que a aula irá ocorrer (ex: "08:00"). */
  horaInicio: string;

  /** Horário de fim que a aula irá ocorrer (ex: "11:30"). */
  horaFim: string;
}

interface Sala {
  salaId: number;
  salaNome: string;
}

export interface AgendamentoData {
  agendamentoId: number;
  sala: Sala;
  disciplinaId: number;
  disciplinaNome: string;
  dataInicio: string;
  dataFim: string;
  horaInicio: string;
  horaFim: string;
  tipo: string;
}

export interface SlotHorario {
  horarioExibicao: string;
  horarioComparacao: string;
  agendamento?: AgendamentoData;
}
