import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Disciplina } from '../../../models/disciplina.model';
import { JanelasHorarioService } from '../../../services/janelas-horario/janelas-horario.service';
import type { JanelaHorario } from '../../../models/janelasHorario.model';
import { TipoSalaService } from '../../../services/tipo-sala/tipo-sala.service';
import type { TipoSala } from '../../../models/tipoSala.mode';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../store/auth/auth.selectors';
import type { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs';
import { RecursoService } from '../../../services/recurso/recurso.service';
import type { Recurso } from '../../../models/Recurso.model';
import type { FormGroup, FormArray } from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import type { AgendarForm } from '../../../types/agendar';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import type {
  BuscarRecomendacaoRequest,
  BuscarRecomendacaoResponse,
} from '../../../types/sala.type';
import { SalaService } from '../../../services/sala/sala.service';
import ProfessorService from '../../../services/professor/professor.service';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import type { AgendamentoAulaCriarRequest } from '../../../types/agendamentoAula.type';
import { AgendamentoService } from '../../../services/agendamento/agendamento.service';
import { FormatUtils } from '../../../utils/format.utils';

@Component({
  selector: 'app-agendamento-aula',
  standalone: false,
  templateUrl: './agendamento-aula.html',
  styleUrl: './agendamento-aula.css',
})
export class AgendamentoAula implements OnInit {
  private professorService = inject(ProfessorService);
  private horariosService = inject(JanelasHorarioService);
  private tipoSalaService = inject(TipoSalaService);
  private recursosService = inject(RecursoService);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private snackBarService = inject(SnackBarService);
  private salaService = inject(SalaService);
  private agendamentoService = inject(AgendamentoService);

  public form!: FormGroup;

  @ViewChild('classInfoModal') classInfoModal!: ConfirmationModal;

  isRecomendacaoLoading = false;
  requisicaoRecomendacao!: BuscarRecomendacaoRequest | null;
  salasRecomendadas: BuscarRecomendacaoResponse | null = null;
  idSalaRecomendadaAtual!: number;
  submittedData!: AgendarForm;
  equipamentoSelectControl = new FormControl<Recurso | null>(null);
  softwareSelectControl = new FormControl<Recurso | null>(null);
  quantidadeControl = new FormControl<number>(1, [Validators.required, Validators.min(1)]);

  disciplinas$!: Observable<Disciplina[]>;
  recursos$!: Observable<Recurso[]>;
  horarios: JanelaHorario[] = [];
  tiposSala: TipoSala[] = [];

  dataMinima: string = ''

  ngOnInit(): void {
    const hoje = new Date()
    this.dataMinima = hoje.toISOString().split('T')[0];
    
    this.form = this.fb.group({
      data: [this.getData(), Validators.required],
      janelaHorarioId: [null, Validators.required],
      tipoSalaId: [null, Validators.required],
      capacidade: [null],
      qtdAulas: [null, Validators.required],
      disciplinaId: [null, Validators.required],
      equipamentosArray: this.fb.array([]),
      softwaresArray: this.fb.array([]),
    });

    this.disciplinas$ = this.store.select(selectUserId).pipe(
      filter((userId): userId is number => !!userId),
      take(1),
      switchMap((userId) => {
        return this.professorService.getDisciplinasDoProfessor(userId);
      }),
    );
    this.horariosService.getJanelasHorario().subscribe({
      next: (data) => (this.horarios = data),
      error: (err) => console.error(err),
    });
    this.tipoSalaService.getTiposSala().subscribe({
      next: (data) => (this.tiposSala = data),
      error: (err) => console.error(err),
    });
    this.recursos$ = this.recursosService.getRecursos();
  }

  get equipamentosArray(): FormArray {
    return this.form.get('equipamentosArray') as FormArray;
  }

  get softwaresArray(): FormArray {
    return this.form.get('softwaresArray') as FormArray;
  }

  getData(): string {
    const hoje = new Date();
    return hoje.toISOString().substring(0, 10);
  }

  adicionarEquipamentoSelecionado(): void {
    const recursoSelecionado = this.equipamentoSelectControl.value;
    const qtd = this.quantidadeControl.value;

    if (
      this.equipamentoSelectControl.invalid ||
      this.quantidadeControl.invalid ||
      !recursoSelecionado
    ) {
      return;
    }

    const isDuplicated = this.equipamentosArray.controls.some(
      (control) => control.value.id === recursoSelecionado.id,
    );

    if (isDuplicated) {
      console.warn(`O equipamento ${recursoSelecionado.id} já foi adicionado.`);
      this.equipamentoSelectControl.reset(null);
      return;
    }

    const novoItemControl = this.fb.group({
      id: [recursoSelecionado.id],
      label: [recursoSelecionado.nome],
      quantity: [qtd, Validators.required],
    });

    this.equipamentosArray.push(novoItemControl);

    this.equipamentoSelectControl.reset(null);
    this.quantidadeControl.setValue(null);
  }

  adicionarSoftwareSelecionado(): void {
    const recursoSelecionado = this.softwareSelectControl.value;

    if (this.softwareSelectControl.invalid || !recursoSelecionado) {
      return;
    }

    const isDuplicated = this.softwaresArray.controls.some(
      (control) => control.value.id === recursoSelecionado.id,
    );

    if (isDuplicated) {
      console.warn(`O equipamento ${recursoSelecionado.id} já foi adicionado.`);
      this.softwareSelectControl.reset(null);
      return;
    }

    const novoItemControl = this.fb.group({
      id: [recursoSelecionado.id],
      label: [recursoSelecionado.nome],
    });

    this.softwaresArray.push(novoItemControl);

    this.softwareSelectControl.reset(null);
  }

  removerItemDoArray(arrayName: 'equipamentosArray' | 'softwaresArray', index: number): void {
    const array = this.form.get(arrayName) as FormArray;
    if (array) {
      array.removeAt(index);
    }
  }

  criarRequisicaoParaRecomendacao(): void {
    const formData = this.form.value;

    const equipamentosIds = this.equipamentosArray.controls.map((control) => control.value.id);
    const softwaresIds = this.softwaresArray.controls.map((control) => control.value.id);
    const recursosIds = [...equipamentosIds, ...softwaresIds];

    const horarioSelecionado = this.horarios.find(
      (h) => h.janelasHorarioId === Number(formData.janelaHorarioId),
    );

    if (!horarioSelecionado) {
      this.snackBarService.showError('Horário não encontrado. Verifique a seleção.');
      this.requisicaoRecomendacao = null;
      return;
    }

    this.requisicaoRecomendacao = {
      capacidade: Number(formData.capacidade),
      data: formData.data,
      horarios: {
        horaFim: horarioSelecionado.horaFim,
        horaInicio: horarioSelecionado.horaInicio,
      },
      recursosIds,
      tipoSalaId: Number(formData.tipoSalaId),
    } as BuscarRecomendacaoRequest;
  }

  buscarRecomendacoes(): void {
    if (!this.requisicaoRecomendacao) {
      return;
    }

    this.isRecomendacaoLoading = true;

    this.salaService.getRecomendacao(this.requisicaoRecomendacao).subscribe({
      next: (data) => {
        this.salasRecomendadas = data;
        this.isRecomendacaoLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isRecomendacaoLoading = false;
      },
    });
  }

  handleBuscarRecomendacoes(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBarService.showError('Preencha todos os campos obrigatórios.');
      return;
    }

    this.submittedData = this.form.value as AgendarForm;

    this.criarRequisicaoParaRecomendacao();

    if (this.requisicaoRecomendacao) {
      this.buscarRecomendacoes();
    }
  }
  openInfoModal(id: number) {
    this.idSalaRecomendadaAtual = id;
    this.classInfoModal.open(id);
  }

  agendarAula() {
    this.store
      .select(selectUserId)
      .pipe(
        filter(Boolean),
        take(1),
        switchMap((userId) => {
          const corpoCriarAgendamento: AgendamentoAulaCriarRequest = {
            usuarioId: userId,
            salaId: Number(this.idSalaRecomendadaAtual),
            disciplinaId: Number(this.submittedData.disciplinaId),
            data: this.submittedData.data,
            janelasHorarioId: Number(this.submittedData.janelaHorarioId),
            isEvento: false,
            quantidade: Number(this.submittedData.qtdAulas),
          };
          return this.agendamentoService.criarAgendamentoAula(corpoCriarAgendamento);;
        }),
      )
      .subscribe({
        next: (_) => {

          this.snackBarService.showSuccess('Agendamento feito com sucesso');
          this.form.reset();
          this.salasRecomendadas = null;
        },
        error: (err) => {
          console.error('Erro ao criar agendamento:', err);
          this.snackBarService.showError('Falha ao agendar. Tente novamente.');
        },
      });
  }

  formatarTempo(inicio: string, fim: string) {
    return FormatUtils.formatTime(inicio, fim);
  }
}
