import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import type { AddItemModal } from '../../shared/add-item-modal/add-item-modal';
import { TipoSalaService } from '../../../services/tipo-sala/tipo-sala.service';
import type { TiposSalas } from '../../../models/tipoSala.mode';
import type { Equipamento } from '../../../types/equipamento';
import type { Software } from '../../../types/software';



@Component({
  selector: 'app-space-registration-form',
  standalone: false,
  templateUrl: './space-registration-form.html',
  styleUrl: './space-registration-form.css'
})
export class SpaceRegistrationForm implements OnInit {
  
  
  @ViewChild('addItemModal') addItemModal!: AddItemModal;
  @Output() formSubmit = new EventEmitter<any>();

  equipamentos: Equipamento[] = [];
  softwares: Software[] = [];
  tiposSalas: TiposSalas[] = [];

  private fb = inject(FormBuilder);
  private currentItemType: 'equipamento' | 'software' | null = null;
  private tipoSalaService = inject(TipoSalaService);
  
  form: FormGroup = this.fb.group({
    nomeEspaco: [''],
    piso: [''],
    capacidade: [''],
    tipoEspaco: [''],
    observacoes: ['']
  });

  ngOnInit(): void {
    this.tipoSalaService.getTiposSalas().subscribe({
      next: (tipos) => {
        this.tiposSalas = tipos;
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de sala:', err);
      }
    });
  }

  @Input() set initialData(data: any) {
    if (data) {
      this.form.patchValue({
        nomeEspaco: data.nomeEspaco,
        piso: data.piso,
        capacidade: data.capacidade,
        tipoEspaco: data.tipoEspaco,
        observacoes: data.observacoes
      });
      this.equipamentos = data.equipamentos || [];
      this.softwares = data.softwares || [];
    }
  }

  onAddItem(tipo: 'equipamento' | 'software') {
    this.currentItemType = tipo;
    this.addItemModal.title = tipo === 'equipamento' ? 'Adicionar Equipamento' : 'Adicionar Software';
    this.addItemModal.nameLabel = tipo === 'equipamento' ? 'Nome do equipamento' : 'Nome do software';
    this.addItemModal.showQuantityField = tipo === 'equipamento';
    this.addItemModal.open();
  }
  
  onItemAdded(item: any) {
    if (!item) { return; }
  
    if (this.currentItemType === 'equipamento') {
      const novoEquipamento: Equipamento = {
        id: crypto.randomUUID(),
        name: item.name,
        quantity: item.quantity
      };
      this.equipamentos.push(novoEquipamento);
    } else {
      const novoSoftware: Software = {
        id: crypto.randomUUID(),
        name: item.name,
      };
      this.softwares.push(novoSoftware);
    }
  }

  remover(tipo: 'equipamento' | 'software', recurso: Equipamento | Software)
  {
    if (tipo === 'equipamento') {
      this.equipamentos = this.equipamentos.filter(r => r.id !== recurso.id);
    } else {
      this.softwares = this.softwares.filter(r => r.id !== recurso.id);
    }
  }

  onSubmitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      formData: this.form.value,
      equipamentos: this.equipamentos,
      softwares: this.softwares
    };

    this.formSubmit.emit(payload);
  }
}
