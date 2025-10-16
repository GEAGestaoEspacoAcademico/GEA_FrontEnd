import type { Field } from '../../components/shared/scheduling/types';
import { Component, ViewChild } from '@angular/core';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-agenda',
  standalone: false,
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda {

  public submittedData: any;
  public fields: Field[] = [
    {
      type: 'date',
      name: 'data',
      label: 'Data',
      defaultValue: new Date().toISOString().split('T')[0],
      validators: {
        required: true,
        errorMessages: { required: 'A data é obrigatória.' }
      }
    },
    {
      type: 'select',
      name: 'horario',
      label: 'Horário',
      defaultValue: '',
      options: [
        { value: '07:40-09:20', label: '07:40 - 09:20' },
        { value: '09:30-11:10', label: '09:30 - 11:10' },
        { value: '11:20-13:00', label: '11:20 - 13:00' },
        { value: '19:00-22:30', label: '19:00 - 22:30' }
      ]
    },
    {
      type: 'select',
      name: 'local',
      label: 'Local',
      defaultValue: 'lab',
      options: [
        { value: 'lab', label: 'Laboratórios' },
        { value: 'sala', label: 'Salas de Aula' },
        { value: 'audit', label: 'Auditório' }
      ]
    },
    {
      type: 'select',
      name: 'capacidade',
      label: 'Capacidade',
      options: [
        { value: '10-20', label: '10 - 20 alunos' },
        { value: '20-30', label: '20 - 30 alunos' },
        { value: '30-40', label: '30 - 40 alunos' },
        { value: '40+', label: 'Mais de 40 alunos' }
      ]
    },
    {
      type: 'select',
      name: 'disciplina',
      label: 'Disciplina',
      options: [
        { value: 'calc1', label: 'Cálculo I' },
        { value: 'redes', label: 'Redes de Computadores' },
        { value: 'ia', label: 'Inteligência Artificial' },
        { value: 'ed', label: 'Estrutura de Dados' }
      ]
    },
    {
      type: 'equipment-select',
      name: 'equipamentos',
      label: 'Equipamento',
      options: [
        { value: 'proj', label: 'Projetor Multimídia' },
        { value: 'pc', label: 'Computador Desktop' },
        { value: 'lousa', label: 'Lousa Digital' },
        { value: 'mic', label: 'Microfone' }
      ]
    },
    {
      type: 'multi-select',
      name: 'softwares',
      label: 'Softwares',
      options: [
        { value: 'netbeans', label: 'NetBeans' },
        { value: 'sqlserver', label: 'SQL Server' },
        { value: 'vscode', label: 'VS Code' },
        { value: 'brmodelo', label: 'BrModelo' },
        { value: 'photoshop', label: 'Photoshop' },
      ]
    },
  ];
  handleFormSubmit(formData: any): void {
    console.log('Formulário submetido! Dados recebidos:', formData);
    this.submittedData = formData;
  }
  @ViewChild('ConfirmationModal')
  confirmModal!: ConfirmationModal;
}
