import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-item-modal',
  standalone: false,
  templateUrl: './add-item-modal.html',
  styleUrl: './add-item-modal.css',
})
export class AddItemModal {
  //Injeta o ngbModal para controle do modal.
  private itemModal = inject(NgbModal);

  //Titulo de dentro do botão.
  @Input() title!: string;
  //Placeholder do input.
  @Input() nameLabel!: string;
  //Controla a visibilidade do campo Qtd, falso para software e true
  //para equipamentos.
  @Input() showQuantityField: boolean = false;
  //Emite o item adicionado e sua quantidade.
  @Output() itemAdd = new EventEmitter<{ name: string; quantity: number | null }>();

  @ViewChild('itemModal')
  modalTemplate!: TemplateRef<AddItemModal>;

  public open(): void {
    this.itemModal.open(this.modalTemplate, {
      backdrop: 'static',
      centered: true,
    });
  }

  novoItem = new FormGroup({
    name: new FormControl(''),
    quantity: new FormControl(null),
  });
}
