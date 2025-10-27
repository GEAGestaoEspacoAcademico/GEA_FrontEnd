import type { OnInit} from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Agendamento } from '../../../models/agendamento.model';
import { FormatUtils } from '../../../utils/format.utils';


@Component({
  selector: 'app-class-info-card',
  standalone: false,
  templateUrl: './class-info-card.html',
  styleUrl: './class-info-card.css'
})
export class ClassInfoCard implements OnInit{
  ngOnInit(): void {
    console.log(this.currentDate)
    console.log(this.classData)
  }
  @Input ({required: true}) classData!: Agendamento;

  @Output() delete = new EventEmitter<number>();
  @Output() view   = new EventEmitter<number>();

  currentDate = FormatUtils.toId(new Date())

  handleDelete(): void { this.delete.emit(this.classData.id); }
  handleView(): void   { this.view.emit(this.classData.id); }
}