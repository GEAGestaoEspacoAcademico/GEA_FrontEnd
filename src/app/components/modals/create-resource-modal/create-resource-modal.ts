import type { TemplateRef } from '@angular/core';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-resource-modal',
  standalone: false,
  templateUrl: './create-resource-modal.html',
  styleUrl: './create-resource-modal.css',
})
export class CreateResourceModal {
  private serviceModal = inject(NgbModal);

  @ViewChild('CreateResourceModal')
  modalTemplate!: TemplateRef<CreateResourceModal>;

  @Output() create = new EventEmitter<{ type: string; name: string }>();
  private currentType!: 'HARDWARE' | 'SOFTWARE';
  modalTitle!: string;
  inputLabel!: string;
  buttonText!: string;

  novoItem = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  public open(type: 'HARDWARE' | 'SOFTWARE'): void {
    this.currentType = type;

    if (type === 'HARDWARE') {
      this.modalTitle = 'Novo Equipamento';
      this.inputLabel = 'Escreva o Nome do Equipamento';
      this.buttonText = 'Criar Equipamento';
    } else if (type === 'SOFTWARE') {
      this.modalTitle = 'Novo Software';
      this.inputLabel = 'Escreva o Nome do Software';
      this.buttonText = 'Criar Software';
    }

    this.serviceModal.open(this.modalTemplate, {
      centered: true,
      windowClass: 'custom-modal',
    });
  }

  onSubmit() {
    this.create.emit({
      type: this.currentType,
      name: this.novoItem.get('name')?.value ?? '',
    });
    this.serviceModal.dismissAll();
    this.novoItem.reset();
  }
}
