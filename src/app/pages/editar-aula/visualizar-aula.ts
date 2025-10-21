  import type { OnInit } from '@angular/core';
  import { Component, inject, ViewChild } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { filter, forkJoin, map, Subject, switchMap, take, takeUntil, tap, type Observable } from 'rxjs';
  import type { Agendamento, EditAgendamento } from '../../models/agendamento.model';
  import {selectAulaById } from '../../store/agendamento/agendamento.selectors';
  import { Store } from '@ngrx/store';
  import { AgendamentoActions } from '../../store/agendamento/agendamento.actions';
  import type { Field } from '../../components/shared/scheduling/types';
  import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';
  import { DisciplinaService } from '../../services/disciplina/disciplina.service';
  import { CursoService } from '../../services/curso/curso.service';
  import type { User } from '../../models/user.model';
  import { selectCurrentUser } from '../../store/auth/auth.selectors';
  import { SalaService } from '../../services/salas/sala.service';
  import type {Option} from '../../components/shared/scheduling/types'

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
    private disciplinaService = inject(DisciplinaService)
    private cursoService = inject(CursoService)
    private salaService = inject(SalaService)
    
    @ViewChild('confirmModal') confirmModal!: ConfirmationModal;
    
    aula$!: Observable<Agendamento | undefined>;
    private destroy$ = new Subject<void>();
    currentUser: User | null = null;
    isloading = false;
    salaIdAtual: number | undefined = undefined;
    cursoIdAtual: number | undefined = undefined;
    

    aulaId: string | null = null;
    agendamentoAtual: Agendamento | null = null;
    pendingFormData: Record<string, any> | null = null;
    formFields!: Field[];

    ngOnInit(): void {
      this.store.select(selectCurrentUser).pipe(
        takeUntil(this.destroy$) // Garante que a inscrição será finalizada
      ).subscribe(user => {
        this.currentUser = user || null; // Armazena o usuário na propriedade
      });
      this.aula$ = this.route.paramMap.pipe(
        map(params => Number(params.get('id'))),
        filter(id => !!id),
        switchMap(id => 
          this.store.select(selectAulaById(id)).pipe(
            tap(aula => {
              if (!aula) {
                this.store.dispatch(AgendamentoActions.loadAgendamentoById({ id }));
              }else if(!this.agendamentoAtual){
                this.agendamentoAtual = aula;
                this.loadDataAndBuildForm();
              }
            })
          )
        )
      );
    }

  private loadDataAndBuildForm(): void {
    if (!this.currentUser || !this.agendamentoAtual) { return; }
    forkJoin({
      disciplinas: this.disciplinaService.getDisciplinaProfessor(this.currentUser.id),
      cursos: this.cursoService.getCursos(),
      salas: this.salaService.getSalas()
    }).pipe(
      take(1)
    ).subscribe(({ disciplinas, cursos, salas }) => {
      this.cursoIdAtual = cursos.find(c => c.nomeCurso === this.agendamentoAtual?.curso)?.id;
      this.salaIdAtual = salas.find(s => s.nome === this.agendamentoAtual?.nomeSala)?.id;
      
      const disciplinaOptions = disciplinas.map(d => ({ label: d.nome, value: d.id }));
      const cursoOptions = cursos.map(c => ({ label: c.nomeCurso, value: c.id }));
      const salaOptions = salas.filter(s => s.disponibilidade === true || s.id === this.salaIdAtual ).map(s => ({ label: s.nome, value: s.id }));

      this.formFields = this.createFormFields(
        this.agendamentoAtual!,
        disciplinaOptions,
        cursoOptions,
        salaOptions
      );
    });
  }

  private createFormFields(
    agendamento: Agendamento,
    disciplinaOptions: Option[], 
    cursoOptions: Option[],      
    salaOptions: Option[]        
  ): Field[] {
    return [
      {
        name: 'disciplinaId',
        label: 'Disciplina',
        type: 'select',
        defaultValue: agendamento.disciplinaId,
        options: disciplinaOptions,
        validators: { required: true, errorMessages: { required: 'O campo disciplina é obrigatório.' } }
      },
      {
        name: 'data',
        label: 'Data',
        type: 'date',
        defaultValue: this.formatDateForInput(agendamento.dataInicio),
        validators: { required: true, errorMessages: { required: 'A data é obrigatória.' } }
      },
      {
        name: 'horario',
        label: 'Horário',
        type: 'select',
        defaultValue: (`${this.formatarHoraParaDropdown(agendamento.horaInicio)}-${this.formatarHoraParaDropdown(agendamento.horaFim)}`),
        options: [
          {label: '7:40-9:20', value: '7:40-9:20'},
          {label: '9:30-11:10', value: '9:30-11:10'},
          {label: '11:20-13:00', value: '11:20-13:00'},
        ],
        validators: { required: true, errorMessages: { required: 'O horário é obrigatório.' } }
      },
      {
        name: 'salaId', 
        label: 'Local',
        type: 'select',
        defaultValue: this.salaIdAtual,
        options: salaOptions,
        validators: { required: true, errorMessages: { required: 'A seleção da sala é obrigatória.' } }
      },
      {
        name: 'cursoId', 
        label: 'Curso',
        type: 'select',
        defaultValue: this.cursoIdAtual,
        options: cursoOptions, 
        validators: { required: true, errorMessages: { required: 'O curso é obrigatório.' } }
      },
      {
        name: "semestre",
        label: "Semestre",
        type: "select",
        defaultValue: agendamento.semestre,
        options: [
          {label: "2024.1", value: "2024.1"},
          {label: "2024.2", value: "2024.2"},
          {label: "2025.1", value: "2025.1"},
          {label: "2025.2", value: "2025.2"},
          {label: "2026.1", value: "2026.1"},
          {label: "2026.2", value: "2026.2"},
        ]
      }
    ];
  }

  formatDateForInput(date: string): string {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = d.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  private formatarHoraParaDropdown(horaComSegundos: string): string {
    const partes = horaComSegundos.split(':');
    const hora = parseInt(partes[0], 10).toString(); 
    const minutos = partes[1];
    return `${hora}:${minutos}`;
}

  formatarHora(date: string): string {
    const data = new Date(date)
    const horas = data.getHours().toString();
    const minutos = data.getMinutes().toString();
    const horasFormatadas = horas.padStart(2, '0');
    const minutosFormatados = minutos.padStart(2, '0');
    return `${horasFormatadas}:${minutosFormatados}`;
  }

  onFormSubmit(formData: Record<string, any>): void {
    if (!this.agendamentoAtual || !this.currentUser) {
      console.error("Dados do agendamento original não encontrados. Não é possível atualizar.");
      return;
    }

    const novaData = new Date(`${formData['data']}T12:00:00Z`);
    const novoDiaDaSemana = novaData.toLocaleDateString('pt-BR', { weekday: 'long' });

    const agendamentoAtualizado: EditAgendamento = {
      dataInicio: formData['data'],
      dataFim: formData['data'],
      diaDaSemana: novoDiaDaSemana,
      horaInicio: this.formateHours(formData['horario'].split('-')[0]),
      horaFim: this.formateHours(formData['horario'].split('-')[1]),
      disciplinaId: Number(formData['disciplinaId']),
      salaId: Number(formData["salaId"]),
    };
    this.store.dispatch(AgendamentoActions.editAgendamento({id: this.agendamentoAtual.id, agendamento: agendamentoAtualizado }));
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

  formateHours(horas: string){
    const [h, m] = horas.split(":")
    const novaData = new Date()
    novaData.setHours(Number(h))
    novaData.setMinutes(Number(m))

    const hora = String(novaData.getHours()).padStart(2, '0');
    const minutos = String(novaData.getMinutes()).padStart(2, '0');

    return `${hora}:${minutos}`
  }
}
