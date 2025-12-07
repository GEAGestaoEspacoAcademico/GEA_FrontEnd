import type { OnInit, TemplateRef } from '@angular/core';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import type { Sala } from '../../../models/sala.model';
import type { AtualizarSalaRequest } from '../../../types/sala.type';
import { TipoSalaService } from '../../../services/tipo-sala/tipo-sala.service';
import type { TipoSala } from '../../../models/tipoSala.mode';

@Component({
  selector: 'app-editar-espaco-modal',
  standalone: false,
  templateUrl: './editar-espaco-modal.html',
  styleUrl: './editar-espaco-modal.css',
})
export class EditarEspacoModal implements OnInit {
  private modalService = inject(NgbModal);
  private tipoSalaService = inject(TipoSalaService);
  private fb = inject(FormBuilder);

  @ViewChild('editarEspacoModalTemplate')
  modalTemplate!: TemplateRef<any>;

  ngOnInit(): void {
    this.tipoSalaService.getTiposSala().subscribe({
      next: (salas) => (this.tipoSalaOpcoes = salas),
    });
  }

  @Output() clickEdit = new EventEmitter<AtualizarSalaRequest>();
  @Output() clickCancel = new EventEmitter<void>();

  form!: FormGroup;
  tipoSalaOpcoes: TipoSala[] = [];
  private salaId!: number;

  public open(sala: Sala): void {
    this.salaId = sala.salaId;

    this.form = this.fb.group({
      salaNome: [sala.salaNome ?? '', Validators.required],
      salaCapacidade: [sala.capacidade, Validators.required],
      piso: [sala.pisoId, Validators.required],
      disponibilidade: [sala.disponibilidade ?? false],
      tipoSalaId: [sala.tipoSalaId ?? '', Validators.required],
      salaObservacoes: [sala.salaObservacoes ?? ''],
    });

    this.form.disable();

    this.modalService.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
      size: 'lg',
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

    const updatedData: AtualizarSalaRequest = {
      salaId: this.salaId,
      ...this.form.value,
    };

    this.clickEdit.emit(updatedData);
    this.modalService.dismissAll();
  }

  public onModalClose(): void {
    this.clickCancel.emit();
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
}
