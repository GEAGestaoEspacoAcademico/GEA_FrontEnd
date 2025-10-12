import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { Class } from '../../models/class.model';

export const AgendamentoActions = createActionGroup({
  source: 'Agendamento',
  events: {
    'Load Aulas': emptyProps(),

    // Ações disparadas pelo Effect após a chamada à API
    'Load Aulas Success': props<{ aulas: Class[] }>(),
    'Load Aulas Failure': props<{ error: string }>(),
    
    // Ações para deletar
    'Delete Aula': props<{ id: number }>(),
    'Delete Aula Success': props<{ id: number }>(),
    'Delete Aula Failure': props<{ error: string }>(),

    // Ação para pegar por id
    'Load Aula By Id': props<{ id: number }>(),
    'Load Aula By Id Success': props<{ aula: Class }>(),
    'Load Aula By Id Failure': props<{ error: string }>(),
  },
});