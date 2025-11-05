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
  @ViewChild('sucessModal') sucessModal!: ConfirmationModal;
  currentIndex!: number;
  roomData: RoomData[] = [
    {
      id: 1,
      nome: 'Sala 01',
      data: '2025-10-20',
      qtdAulas: 2,
      horario: '10:00 - 11:00',
      capacidade: '12 pessoas',
      equipamentos: ['Projetor Multimídia', 'Computador Desktop'],
      observacoes: ['Possui projetor', 'Quadro branco disponível'],
    },
    {
      id: 2,
      nome: 'Laboratório 2',
      data: '2025-10-21',
      qtdAulas: 3,
      horario: '14:00 - 16:30',
      capacidade: '50 pessoas',
      equipamentos: ['Lousa Digital', 'Computador Desktop'],
      observacoes: ['Necessário microfone', 'Sistema de som integrado'],
    },
    {
      id: 3,
      nome: 'Sala 9',
      data: '2025-10-20',
      qtdAulas: 1,
      horario: '09:00 - 10:30',
      capacidade: '8 pessoas',
      equipamentos: ['Computador Desktop'],
      observacoes: ['Pufes e área de descanso', 'Muitos post-its'],
    },
    {
      id: 4,
      nome: 'Auditório',
      data: '2025-10-22',
      qtdAulas: 4,
      horario: '08:00 - 12:00',
      capacidade: '150 pessoas',
      equipamentos: ['Sistema de som', 'Microfones sem fio'],
      observacoes: ['Palco elevado', 'Equipamento de tradução simultânea (solicitar)'],
    },
    {
      id: 5,
      nome: 'Laboratório 4',
      data: '2025-10-20',
      qtdAulas: 2,
      horario: '15:00 - 15:30',
      capacidade: '4 pessoas',
      equipamentos: ['Computador Desktop', 'Projetor Multimídia'],
      observacoes: ['Ambiente silencioso', 'Água disponível'],
    },
  ];
  public fields: Field[] = [
    {
      type: 'date',
      name: 'data',
      label: 'Data',
      defaultValue: new Date().toISOString().split('T')[0],
      validators: {
        required: true,
        errorMessages: { required: 'A data é obrigatória.' },
      },
    },
    {
      type: 'select',
      name: 'qtd aulas',
      label: 'Qtd de aulas',
      options: [
        {value: '1', label: '1 Aulas'},
        {value: '2', label: '2 Aulas'},
        {value: '3', label: '3 Aulas'},
        {value: '4', label: '4 Aulas'},
        {value: '5', label: '5 Aulas'},
        {value: '6', label: '6 Aulas'},
      ],
      validators: {
        required: true,
        errorMessages: {required: 'A quantidade de aulas é obrigatória'}
      }
    },
    {
      type: 'select',
      name: 'horario',
      label: 'Horário',
      defaultValue: '07:40-09:20',
      options: [
        { value: '07:40-09:20', label: '07:40 - 09:20' },
        { value: '09:30-11:10', label: '09:30 - 11:10' },
        { value: '11:20-13:00', label: '11:20 - 13:00' },
        { value: '19:00-22:30', label: '19:00 - 22:30' },
      ],
      validators: {
        required: true,
        errorMessages: {required: 'A quantidade de aulas é obrigatória'}
      }
    },
    {
      type: 'select',
      name: 'curso',
      label: 'Curso',
      options: [
        { value: 'ADS', label: 'Análise e Desenvolvimento de sistemas' },
        { value: 'GTI', label: 'Gestão da Informação' },
        { value: 'MECA', label: 'Mecatrônica' },
      ],
      validators: {
        required: true,
        errorMessages: {required: 'A quantidade de aulas é obrigatória'}
      }
    },
    {
      type: 'select',
      name: 'disciplina',
      label: 'Disciplina',
      defaultValue: 'calc1',
      options: [
        { value: 'calc1', label: 'Cálculo I' },
        { value: 'redes', label: 'Redes de Computadores' },
        { value: 'ia', label: 'Inteligência Artificial' },
        { value: 'ed', label: 'Estrutura de Dados' },
      ],
      validators: {
        required: true,
        errorMessages: {required: 'A quantidade de aulas é obrigatória'}
      }
    },
    {
      type: 'select',
      name: 'local',
      label: 'Local',
      defaultValue: 'lab',
      options: [
        { value: 'lab', label: 'Laboratórios' },
        { value: 'sala', label: 'Salas de Aula' },
        { value: 'audit', label: 'Auditório' },
      ],
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
        { value: '40+', label: 'Mais de 40 alunos' },
      ],
    },
    {
      type: 'equipment-select',
      name: 'equipamentos',
      label: 'Equipamento',
      options: [
        { value: 'proj', label: 'Projetor Multimídia' },
        { value: 'pc', label: 'Computador Desktop' },
        { value: 'lousa', label: 'Lousa Digital' },
        { value: 'mic', label: 'Microfone' },
      ],
      validators: {
        required: true,
        errorMessages: {required: 'A quantidade de aulas é obrigatória'}
      }
    }
  ];
  handleFormSubmit(formData: any): void {
    this.submittedData = formData;
  }

  openInfoModal(id: number) {
    this.currentIndex = id - 1;
    this.classInfoModal.open();
  }

  openSucessModal() {
    this.classInfoModal.onModalClose();
    setTimeout(() => {
      this.sucessModal.open();
    }, 50);
  }
}
