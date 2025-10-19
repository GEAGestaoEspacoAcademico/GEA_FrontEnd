  import type { OnInit } from '@angular/core';
  import { Component, inject, ViewChild } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { filter, map, switchMap, tap, type Observable } from 'rxjs';
  import type { Agendamento } from '../../models/agendamento.model';
  import { selectAgendamentoLoading, selectAulaById } from '../../store/agendamento/agendamento.selectors';
  import { Store } from '@ngrx/store';
  import { AgendamentoActions } from '../../store/agendamento/agendamento.actions';
  import type { Field } from '../../components/shared/scheduling/types';
  import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';

  @Component({
    selector: 'app-editar-aula',
    standalone: false,
    templateUrl: './editar-aula.html',
    styleUrl: './editar-aula.css'
  })
  export class EditarAula implements OnInit{
    private route = inject(ActivatedRoute)
    private router = inject(Router)
    private store = inject(Store)

    @ViewChild('confirmModal') confirmModal!: ConfirmationModal;

    aula$!: Observable<Agendamento | undefined>;
    loading$: Observable<boolean> = this.store.select(selectAgendamentoLoading);

    aulaId: string | null = null;
    agendamentoAtual: Agendamento | null = null;
    pendingFormData: Record<string, any> | null = null;
    formFields: Field[] | undefined;

    ngOnInit(): void {
      this.aula$ = this.route.paramMap.pipe(
        map(params => Number(params.get('id'))),
        filter(id => !!id),
        switchMap(id => 
          this.store.select(selectAulaById(id)).pipe(
            tap(aula => {
              if (!aula) {
                this.store.dispatch(AgendamentoActions.loadAgendamentoById({ id }));
              }else{
                this.agendamentoAtual = aula;
                this.formFields = this.createFormFields(aula)
              }
            })
          )
        )
      );
    }

    private createFormFields(agendamento: Agendamento): Field[] {
      return [
        {
          name: 'disciplina',
          label: 'Disciplina',
          type: 'select',
          defaultValue: agendamento.disciplina,
          options: [
            {label: 'Disciplina 1', value: 'Disciplina 1'},
            {label: 'Disciplina 2', value: 'Disciplina 2'},
            {label: 'Disciplina 3', value: 'Disciplina 3'},
          ],
          validators: { required: true, errorMessages: { required: 'O campo disciplina é obrigatório.' } }
        },
        {
          name: 'data',
          label: 'Data',
          type: 'date',
          defaultValue: this.formatDateForInput(agendamento.dataInicio),
          validators: { required: true, errorMessages: { required: 'A seleção da sala é obrigatória.' } }
        },
        {
          name: 'horario',
          label: 'Horario',
          type: 'select', 
          defaultValue: (`${this.formatarHora(agendamento.dataInicio)}-${this.formatarHora(agendamento.dataFinal)}`),
          options: [
            {label: '7:40-9:20', value: '7:40-9:20'},
            {label: '9:30-11:10', value: '9:30-11:10'},
            {label: '11:20-13:00', value: '11:20-13:00'},
          ],
          validators: { required: true, errorMessages: { required: 'A seleção da sala é obrigatória.' } }
        },
        {
          name: 'local',
          label: 'Local',
          type: 'select',
          defaultValue: agendamento.local,
          options: [
              { value: 'Sala A', label: 'Sala A' },
              { value: 'Sala B', label: 'Sala B' },
              { value: 'Laboratório 1', label: 'Laboratório 1' },
          ],
          validators: { required: true, errorMessages: { required: 'A seleção da sala é obrigatória.' } }
        },
        {
          name: 'curso',
          label: 'Curso',
          type: 'select',
          defaultValue: agendamento.curso,
          options: [
            { value: 1, label: 'ADS' },
            { value: 2, label: 'Mecatronica' },
            { value: 3, label: 'GTI' },
          ],
          validators: { required: true, errorMessages: { required: 'A data de início é obrigatória.' } }
        },
      ];
    }

    formatDateForInput(date: Date): string {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    formatarHora(data: Date): string {
      const horas = data.getHours().toString();
      const minutos = data.getMinutes().toString();
      const horasFormatadas = horas.padStart(2, '0');
      const minutosFormatados = minutos.padStart(2, '0');
      return `${horasFormatadas}:${minutosFormatados}`;
    }
  onFormSubmit(formData: Record<string, any>): void {
    if (!this.agendamentoAtual) {
      console.error("Dados do agendamento original não encontrados. Não é possível atualizar.");
      return;
    }
  
    const novaData = new Date(`${formData['data']}T12:00:00`);
    
    const [horaInicioStr, horaFimStr] = formData['horario'].split('-');
    const [horaInicio, minInicio] = horaInicioStr.split(':').map(Number);
    const [horaFim, minFim] = horaFimStr.split(':').map(Number);

    const novaDataInicio = new Date(novaData);
    novaDataInicio.setHours(horaInicio, minInicio, 0, 0);

    const novaDataFim = new Date(novaData);
    novaDataFim.setHours(horaFim, minFim, 0, 0);
    
    const novoDiaDaSemana = novaData.toLocaleDateString('pt-BR', { weekday: 'long' });

    const agendamentoAtualizado: Agendamento = {
      ...this.agendamentoAtual,
      local: formData['local'],
      dataInicio: novaDataInicio,
      dataFinal: novaDataFim,
      diaDaSemana: novoDiaDaSemana,
      horario: formData['horario'],
      disciplina: formData['disciplina'],
      curso: formData['curso'],
    };
    this.store.dispatch(AgendamentoActions.editAgendamento({ agendamento: agendamentoAtualizado }));
    console.log(agendamentoAtualizado);
    this.router.navigate(['/aulas']);
  }

  onScheduleSubmitAttempt(formData: Record<string, any>): void {
    this.pendingFormData = formData;
    this.confirmModal.open(); 
  }

  onConfirmSubmit(): void {
    if (this.pendingFormData) {
        this.onFormSubmit(this.pendingFormData);
        this.pendingFormData = null;
    } else {
        console.error("Confirmação de submit sem dados pendentes.");
    }
  }

  confirmCancel(): void {
    this.pendingFormData = null;
  }
}
