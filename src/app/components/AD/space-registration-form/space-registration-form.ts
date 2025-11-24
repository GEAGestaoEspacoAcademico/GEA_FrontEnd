import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import type { FormArray, FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import type { AddItemModal } from '../../modals/add-item-modal/add-item-modal';
import { TipoSalaService } from '../../../services/tipo-sala/tipo-sala.service';
import type { Recurso } from '../../../models/Recurso.model';
import type { TipoSala } from '../../../models/tipoSala.mode';
import { RecursoService } from '../../../services/recurso/recurso.service';
import type { AddItemModalData } from '../../../types/additemmodal';
import type { CriarSalaFormulario } from '../../../types/util.types';

@Component({
  selector: 'app-space-registration-form',
  standalone: false,
  templateUrl: './space-registration-form.html',
  styleUrl: './space-registration-form.css',
})
export class SpaceRegistrationForm implements OnInit {
  @Input() isLoading: boolean = false;
  @Output() clickSave = new EventEmitter<CriarSalaFormulario>();
  @Output() clickCancel = new EventEmitter<void>();

  @ViewChild('addItemModal') addItemModal!: AddItemModal;

  tiposDeSala: TipoSala[] = [];

  recursosDisponiveis: Recurso[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly tipoSalaService = inject(TipoSalaService);
  private readonly recursoService = inject(RecursoService);

  atualizarListaDisponivel() {
    const recursosSelecionados = this.equipamentosFA.value.map((item: Recurso) => item.nome);

    this.recursosDisponiveis = this.recursosDisponiveis.filter(
      (recurso) => !recursosSelecionados.includes(recurso.nome),
    );
  }

  ngOnInit(): void {
    this.tipoSalaService.getTiposSala().subscribe({
      next: (tipos) => {
        this.tiposDeSala = tipos.filter(
          (t) => t.tipoSalaNome.trim().toUpperCase().replaceAll(/\s/g, '') !== 'SALADEAULA',
        );
      },
      error: (err) => console.error('Erro ao carregar tipos de sala', err),
    });

    this.recursoService.getRecursos().subscribe({
      next: (recursos) => {
        this.recursosDisponiveis = recursos;
      },
      error: (err) => console.error('Erro ao carregar recursos', err),
    });

    this.equipamentosFA.valueChanges.subscribe(() => {
      this.atualizarListaDisponivel();
    });
  }

  form: FormGroup = this.fb.group({
    tipoSalaId: ['', Validators.required],
    salaNome: ['', Validators.required],
    salaCapacidade: ['', Validators.required],
    pisoId: ['', Validators.required],
    disponibilidade: [true],
    salaObservacoes: [''],
    equipamentos: this.fb.array([]),
  });

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
    if (!item) {
      return;
    }
    this.equipamentosFA.push(
      this.fb.group({
        recursoId: item.recursoId,
        nome: item.name,
        quantidadeRecurso: item.quantity ?? 1,
      }),
    );
  }

  removerEquipamento(i: number) {
    this.equipamentosFA.removeAt(i);
  }

  onSave() {
    this.clickSave.emit(this.form.getRawValue());
  }

  onCancel() {
    this.clickCancel.emit();
  }
}
