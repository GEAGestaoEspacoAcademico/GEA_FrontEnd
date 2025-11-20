import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { AgendamentoAula } from '../../models/agendamentoAula.model';
import type { AgendamentoAulaEditarRequest } from '../../types/agendamentoAula.type';

export const AgendamentoActions = createActionGroup({
  source: 'Agendamento',
  events: {
    'Load Agendamentos': emptyProps(),
    'Load Agendamentos Success': props<{ agendamentos: AgendamentoAula[] }>(),
    'Load Agendamentos Failure': props<{ error: string }>(),

    // Delete
    'Delete Agendamento': props<{ id: number }>(),
    'Delete Agendamento Success': props<{ id: number }>(),
    'Delete Agendamento Failure': props<{ error: string }>(),

    'Load Agendamento By Id': props<{ id: number }>(),
    'Load Agendamento By Id Success': props<{ agendamento: AgendamentoAula }>(), 
    'Load Agendamento By Id Failure': props<{ error: string }>(),

    'Edit Agendamento': props<{ id: number, agendamento: AgendamentoAulaEditarRequest }>(),
    'Edit Agendamento Success': props<{ agendamento: AgendamentoAula }>(),
    'Edit Agendamento Failure': props<{ error: string }>(),
    
    'Clear Selected Agendamento': emptyProps(),
  },
});