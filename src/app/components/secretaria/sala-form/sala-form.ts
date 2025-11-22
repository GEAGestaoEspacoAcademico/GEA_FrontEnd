import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import type { FormArray } from '@angular/forms';
import { FormBuilder, Validators, type FormGroup } from '@angular/forms';
import type { AddItemModal } from '../../shared/add-item-modal/add-item-modal';
import type { TipoSala } from '../../../models/tipoSala.mode';
import { TipoSalaService } from '../../../services/tipo-sala/tipo-sala.service';
import type { AddItemModalData } from '../../../types/additemmodal';
import type { Recurso } from '../../../models/Recurso.model';
import { RecursoService } from '../../../services/recurso/recurso.service';

@Component({
  selector: 'app-sala-form',
  standalone: false,
  templateUrl: './sala-form.html',
  styleUrl: './sala-form.css',
})
export class SalaForm implements OnInit {
  @Input() isLoading: boolean = false;
  @Output() clickSave = new EventEmitter<FormGroup>();
  @Output() clickCancel = new EventEmitter<void>();

  @ViewChild('addItemModal') addItemModal!: AddItemModal;

  tiposSalas: TipoSala[] = [];

  recursosDisponiveis: Recurso[] = [];

  private fb = inject(FormBuilder);
  private tipoSalaService = inject(TipoSalaService);
  private recursoService = inject(RecursoService);

  form: FormGroup = this.fb.group({
    idTipoSala: ['', Validators.required],
    nome: ['', Validators.required],
    capacidade: ['', Validators.required],
    piso: ['', Validators.required],
    disponibilidade: [true],
    observacoes: [''],
    equipamentos: this.fb.array([]),
  });

  ngOnInit(): void {
    this.tipoSalaService.getTiposSala().subscribe({
      next: (tipos) => (this.tiposSalas = tipos),
      error: (err) => console.error('Erro ao carregar tipos de sala', err),
    });

    this.recursoService.getRecursos().subscribe({
        next: (recursos) => {
            this.recursosDisponiveis = recursos;
        },
        error: (err) => console.error('Erro ao carregar recursos', err),
    });
  }

  get equipamentosFA(): FormArray {
    return this.form.get('equipamentos') as FormArray;
  }

  onAddEquipamento(event?: Event) {
    (event?.target as HTMLElement)?.blur();

    this.addItemModal.title = 'Adicionar Equipamento';
    this.addItemModal.nameLabel = 'Nome do equipamento';
    this.addItemModal.showQuantityField = true;
    this.addItemModal.open();
  }

  onItemAdded(item: AddItemModalData) {
    if (!item || !item.recursoId) {
      return;
    }

    this.equipamentosFA.push(
      this.fb.group({
        idRecurso: item.recursoId,
        nome: item.name,
        quantidade: item.quantity ?? 1,
      }),
    );
  }

  removerEquipamento(i: number) {
    this.equipamentosFA.removeAt(i);
  }

  onSave() {
    this.clickSave.emit(this.form.value);
  }

  onCancel() {
    this.clickCancel.emit();
  }
}
