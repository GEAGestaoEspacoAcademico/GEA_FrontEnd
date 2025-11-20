import type { TemplateRef} from '@angular/core';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import type { FormArray, FormGroup} from '@angular/forms';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { Disciplina, Espaco, EspacoEditPayload } from '../../../types/edita-espacos';

@Component({
  selector: 'app-editar-espaco-modal',
  standalone: false,
  templateUrl: './editar-espaco-modal.html',
  styleUrl: './editar-espaco-modal.css'
})
export class EditarEspacoModal {
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);

  @Output() clickEdit = new EventEmitter<EspacoEditPayload>();
  @Output() clickCancel = new EventEmitter<void>();

  @ViewChild('editarEspacoModalTemplate') modalTemplate!: TemplateRef<any>;

  form!: FormGroup;
  private espacoId!: number;

  /** Controla se o modal está em modo edição */
  public editing = false;

  constructor() {
    this.criarForm();
  }

  /** Cria o formulário com os controles desabilitados inicialmente */
  private criarForm(): void {
    this.form = this.fb.group({
      nome: [{ value: '', disabled: true }, Validators.required],
      piso: [{ value: '', disabled: true }],
      tipoDeEspaco: [{ value: '', disabled: true }],
      disciplinas: this.fb.array([]),
      indisponivel: [{ value: false, disabled: true }],
    });
  }

  get disciplinasArray(): FormArray {
    return this.form.get('disciplinas') as FormArray;
  }

  /** Método chamado pelo componente pai */
  public open(espaco: Espaco): void {
    if (!espaco) {return};

    this.espacoId = espaco.id;

    // Resetar array de disciplinas
    this.disciplinasArray.clear();

    (espaco.disciplinas ?? []).forEach(d => {
      this.disciplinasArray.push(
        new FormControl({ id: d.id, nome: d.nome }, Validators.required)
      );
    });

    // Preencher valores
    this.form.patchValue({
      nome: espaco.nome ?? '',
      piso: espaco.piso ?? '',
      tipoDeEspaco: espaco.tipoDeEspaco ?? '',
      indisponivel: !!espaco.indisponivel,
    });

    // Desabilitar tudo conforme solicitado no enunciado
    this.form.disable();
    this.editing = false;

    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true
    });
  }

  /** Ativa edição */
  public onModalEdit(): void {
    this.form.enable();
    this.editing = true;
  }

  public removeDisciplina(index: number): void {
    this.disciplinasArray.removeAt(index);
  }

  public addDisciplinaByName(nome: string): void {
    if (!nome?.trim()) {return};
    this.disciplinasArray.push(
      new FormControl({ nome: nome.trim() }, Validators.required)
    );
  }

  /** Enviar dados atualizados */
  public onModalSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return};

    const disciplinas: Disciplina[] = this.disciplinasArray.controls.map(ctrl => {
      const val = ctrl.value;
      return { id: val?.id, nome: val?.nome ?? '' };
    });

    const payload: EspacoEditPayload = {
      id: this.espacoId,
      nome: this.form.get('nome')!.value,
      piso: this.form.get('piso')!.value,
      tipoDeEspaco: this.form.get('tipoDeEspaco')!.value,
      disciplinas,
      indisponivel: !!this.form.get('indisponivel')!.value,
    };

    this.clickEdit.emit(payload);
    this.modalService.dismissAll();
    this.editing = false;
  }

  public onModalClose(): void {
    this.modalService.dismissAll();
    this.clickCancel.emit();
    this.editing = false;
  }
}
