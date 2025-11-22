import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import type { TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import type { Recurso } from '../../../models/Recurso.model';

@Component({
  selector: 'app-add-item-modal',
  standalone: false,
  templateUrl: './add-item-modal.html',
  styleUrl: './add-item-modal.css',
})
export class AddItemModal {
  private itemModal = inject(NgbModal);

  @Input() title!: string;

  @Input() nameLabel!: string;

  @Input() showQuantityField: boolean = false;

  @Input() recursosDisponiveis: Recurso[] = [];

  @Output() itemAdd = new EventEmitter<{ recursoId: number; name: string; quantity: number | null }>();

  @ViewChild('itemModal')
  modalTemplate!: TemplateRef<AddItemModal>;

  public open(): void {
    this.itemModal.open(this.modalTemplate, {
      centered: true,
      windowClass: 'custom-modal',
    });
  }

  novoItem = new FormGroup({
    recursoId: new FormControl('', Validators.required),
    quantity: new FormControl(1),
  });

  onSubmit() {
    if (this.novoItem.invalid) {return};

    const recursoIdString = this.novoItem.value.recursoId;
    const recursoId: number = Number(recursoIdString);
    const recursoSelecionado = this.recursosDisponiveis.find(r => r.id === recursoId);

    if (!recursoSelecionado) {return};

    const item = {
      recursoId: recursoSelecionado.id,
      name: recursoSelecionado.nome,
      quantity: this.novoItem.value.quantity ?? 1
    };
  
    this.itemAdd.emit(item);
    this.itemModal.dismissAll();
    this.novoItem.reset({ recursoId: '', quantity: 1 });
  }
  
  
}
