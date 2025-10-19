import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { Agendamento, EditAgendamento } from '../../models/agendamento.model';

export const AgendamentoActions = createActionGroup({
  source: 'Agendamento',
  events: {
    'Load Agendamentos': emptyProps(),

    // Ações disparadas pelo Effect após a chamada à API
    'Load Agendamentos Success': props<{ agendamentos: Agendamento[] }>(),
    'Load Agendamentos Failure': props<{ error: string }>(),
    
    // Ações para deletar
    'Delete Agendamento': props<{ id: number }>(),
    'Delete Agendamento Success': props<{ id: number }>(),
    'Delete Agendamento Failure': props<{ error: string }>(),

    // Ação para pegar por id
    'Load Agendamento By Id': props<{ id: number }>(),
    'Load Agendamento By Id Success': props<{ agendamento: Agendamento }>(),
    'Load Agendamento By Id Failure': props<{ error: string }>(),

    //Ação para editar por id
    'Edit Agendamento': props<{ id: number, agendamento: EditAgendamento}>(),
    'Edit Agendamento Success': props<{ agendamento: Agendamento }>(),
    'Edit Agendamento Failure': props<{ error: string }>(),
  },
});