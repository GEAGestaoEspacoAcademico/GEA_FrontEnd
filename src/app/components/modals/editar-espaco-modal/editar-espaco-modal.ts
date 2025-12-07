import type { OnInit, TemplateRef } from '@angular/core';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { Sala } from '../../../models/sala.model';
import type {
  AdicionarRecursoSalaRequest,
  AtualizarSalaRequest,
  BuscarRecursoSalaResponseArray,
  RecursoAdiconarSala,
} from '../../../types/sala.type';
import { TipoSalaService } from '../../../services/tipo-sala/tipo-sala.service';
import type { TipoSala } from '../../../models/tipoSala.mode';
import { SalaService } from '../../../services/sala/sala.service';
import type { AddItemModal } from '../add-item-modal/add-item-modal';
import type { Observable } from 'rxjs';
import { forkJoin, of, switchMap } from 'rxjs';
import { RecursoService } from '../../../services/recurso/recurso.service';

@Component({
  selector: 'app-editar-espaco-modal',
  standalone: false,
  templateUrl: './editar-espaco-modal.html',
  styleUrl: './editar-espaco-modal.css',
})
export class EditarEspacoModal implements OnInit {
  private modalService = inject(NgbModal);
  private tipoSalaService = inject(TipoSalaService);
  private salaService = inject(SalaService);
  private recursoService = inject(RecursoService);
  private fb = inject(FormBuilder);

  @ViewChild('editarEspacoModalTemplate')
  modalTemplate!: TemplateRef<EditarEspacoModal>;

  @ViewChild('addItemModal') addItemModal!: AddItemModal;

  ngOnInit(): void {
    this.tipoSalaService.getTiposSala().subscribe({
      next: (salas) => (this.tipoSalaOpcoes = salas),
    });
  }

  @Output() clickEdit = new EventEmitter<AtualizarSalaRequest>();
  @Output() clickCancel = new EventEmitter<void>();

  form!: FormGroup;
  tipoSalaOpcoes: TipoSala[] = [];
  recursosSala: BuscarRecursoSalaResponseArray[] = [];
  private recursosParaDeletar: number[] = [];
  private recursosParaAdicionar: RecursoAdiconarSala[] = [];
  private salaId!: number;

  isLaboratorio: boolean = false;

  public open(sala: Sala): void {
    this.salaId = sala.salaId;

    this.recursosSala = [];

    this.verificarLab(sala.tipoSalaId);

    this.salaService.getRecursosSalaPorIdArray(this.salaId).subscribe({
      next: (recursosSala) => {
        this.recursosSala = recursosSala;
        console.log(this.recursosSala);
      },
    });

    this.form = this.fb.group({
      salaNome: [sala.salaNome ?? '', Validators.required],
      salaCapacidade: [sala.capacidade, Validators.required],
      piso: [sala.pisoId, Validators.required],
      disponibilidade: [sala.disponibilidade ?? false],
      tipoSalaId: [sala.tipoSalaId ?? '', Validators.required],
      salaObservacoes: [sala.salaObservacoes ?? ''],
      recursoControl: [''],
    });

    this.form.disable();

    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
      size: 'lg',
      animation: false,
    });
  }

  public onModalEdit(): void {
    this.form.enable();
  }

  public onModalSave(): void {
    if (this.form.invalid) {
      return;
    }

    this.form.enable();

    const rawValues = this.form.getRawValue();

    const updatedData: AtualizarSalaRequest = {
      salaNome: rawValues.salaNome,
      salaCapacidade: rawValues.salaCapacidade,
      pisoId: Number(rawValues.piso),
      tipoSalaId: Number(rawValues.tipoSalaId),

      disponibilidade: rawValues.disponibilidade,
      salaObservacoes: rawValues.salaObservacoes,
    };

    const operacoesDeRecursos: Array<Observable<any>> = [];

    if (this.recursosParaDeletar.length > 0) {
      const delecoes = this.recursosParaDeletar.map((recursoId) =>
        this.salaService.deleteRecursoSala(this.salaId, recursoId),
      );
      operacoesDeRecursos.push(...delecoes);
    }

    if (this.recursosParaAdicionar.length > 0) {
      const requestBody: AdicionarRecursoSalaRequest = {
        listaDeRecursosParaAdicionar: this.recursosParaAdicionar,
      };
      const adicao = this.salaService.adicionarRecursoEmSala(this.salaId, requestBody);
      operacoesDeRecursos.push(adicao);
    }

    this.salaService
      .editSala(this.salaId, updatedData)
      .pipe(
        switchMap(() => {
          if (operacoesDeRecursos.length === 0) {
            return of(null);
          }
          return forkJoin(operacoesDeRecursos);
        }),
      )
      .subscribe({
        next: () => {
          this.recursosParaDeletar = [];
          this.recursosParaAdicionar = [];

          this.clickEdit.emit(updatedData);

          this.modalService.dismissAll();
        },
      });
  }

  public onModalClose(): void {
    this.clickCancel.emit();
    this.modalService.dismissAll();
  }

  public fecharmodal(): void {
    this.modalService.dismissAll();
  }

  get isDisponivel(): boolean {
    return this.form.get('disponibilidade')?.value ?? false;
  }

  toggleDisponibilidade() {
    const control = this.form.get('disponibilidade');
    if (control) {
      const novoValor = !control.value;
      control.setValue(novoValor);
      control.markAsDirty();
    }
  }

  public removeRecurso(recurso: BuscarRecursoSalaResponseArray): void {
    const index = this.recursosSala.indexOf(recurso);

    if (index >= 0) {
      this.recursosSala.splice(index, 1);
      this.recursosParaDeletar.push(recurso.idRecurso);
    }
  }

  private verificarLab(id: number | undefined): void {
    if (!id) {
      this.isLaboratorio = false;
      return;
    }
    const tipo = this.tipoSalaOpcoes.find((t) => t.tipoSalaId === id);
    this.isLaboratorio = tipo ? /lab/i.test(tipo.tipoSalaNome) : false;
  }
}
