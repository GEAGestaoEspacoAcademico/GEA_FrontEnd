import type { Field } from '../../components/shared/scheduling/types';
import { Component, ViewChild } from '@angular/core';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';
import type { RoomData } from '../../models/room.model';

@Component({
  selector: 'app-agenda',
  standalone: false,
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda {

  public submittedData: any;
  @ViewChild('classInfoModal') classInfoModal!: ConfirmationModal;
  currentIndex!: number;
  roomData: RoomData[] = 
  [
  {
    "id": 1,
    "nome": "Sala 01",
    "data": "2025-10-20",
    "horario": "10:00 - 11:00",
    "capacidade": "12 pessoas",
    "observacoes": ["Possui projetor", "Quadro branco disponível"]
  },
  {
    "id": 2,
    "nome": "Laboratório 2",
    "data": "2025-10-21",
    "horario": "14:00 - 16:30",
    "capacidade": "50 pessoas",
    "observacoes": ["Necessário microfone", "Sistema de som integrado"]
  },
  {
    "id": 3,
    "nome": "Sala 9",
    "data": "2025-10-20",
    "horario": "09:00 - 10:30",
    "capacidade": "8 pessoas",
    "observacoes": ["Pufes e área de descanso", "Muitos post-its"]
  },
  {
    "id": 4,
    "nome": "Auditório",
    "data": "2025-10-22",
    "horario": "08:00 - 12:00",
    "capacidade": "150 pessoas",
    "observacoes": ["Palco elevado", "Equipamento de tradução simultânea (solicitar)"]
  },
  {
    "id": 5,
    "nome": "Laboratório 4",
    "data": "2025-10-20",
    "horario": "15:00 - 15:30",
    "capacidade": "4 pessoas",
    "observacoes": ["Ambiente silencioso", "Água disponível"]
  }
]
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
      defaultValue: 'Selecione',
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
      defaultValue: 'Selecione',
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
      defaultValue: '10-20',
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
      defaultValue: "Selecione",
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
    this.submittedData = formData;
  }

  openModal(id: number){
    this.currentIndex = id-1;
    this.classInfoModal.open();
  }

}
