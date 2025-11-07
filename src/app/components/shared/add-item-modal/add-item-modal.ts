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
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  @Output() itemAdd = new EventEmitter<{ name: string; quantity: number | null }>();

  @ViewChild('itemModal')
  modalTemplate!: TemplateRef<AddItemModal>;

  public open(): void {
    this.itemModal.open(this.modalTemplate, {
      centered: true,
      size: 'lg',
    });
  }

  novoItem = new FormGroup({
    name: new FormControl('', Validators.required),
    quantity: new FormControl(),
  });

  onSubmit() {
    this.itemAdd.emit();
    this.itemModal.dismissAll();
    this.novoItem.reset();
  }
}
