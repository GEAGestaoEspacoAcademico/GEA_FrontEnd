export interface Agendamento {
    id: number;
    local: string;
    dataInicio: Date,
    dataFinal: Date,
    diaDaSemana: string,
    horario: string,
    disciplina: string,
    semestre: string,
    curso: string
}
