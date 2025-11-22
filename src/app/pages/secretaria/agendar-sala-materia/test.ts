import { Component, Injectable, effect, inject, signal, computed, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import type { Observable} from 'rxjs';
import { of, delay, firstValueFrom } from 'rxjs';

// =========================================================================
// 1. MODELOS & ENUMS
// =========================================================================

export enum TIPOSALA {
  SALA = 'Sala de Aula',
  LABORATORIO = 'Laboratório',
  AUDITORIO = 'Auditório'
}

export interface Disciplina {
  disciplinaId: number;
  disciplinaNome: string;
  disciplinaSemestre: string;
  cursoNome: string;
}

export interface SalaOpcao {
  salaId: number;
  salaNome: string;
  // Outros campos opcionais para não quebrar se vierem objetos completos
  [key: string]: any; 
}

export interface JanelaHorario {
  janelasHorarioId: number;
  horaInicio: string;
  horaFim: string;
}

export interface SchedulingFormValue {
  disciplina: number;
  local: number;
  horarios: boolean[];
}

// =========================================================================
// 2. SERVICE MOCK (Simulando Backend)
// =========================================================================

@Injectable({ providedIn: 'root' })
export class MockDataService {
  public getDisciplinas(): Disciplina[] {
    return [
      { disciplinaId: 1, disciplinaNome: 'Matemática Avançada', disciplinaSemestre: '1', cursoNome: 'Engenharia' },
      { disciplinaId: 2, disciplinaNome: 'Desenvolvimento Web', disciplinaSemestre: '2', cursoNome: 'Sistemas' },
      { disciplinaId: 3, disciplinaNome: 'Banco de Dados', disciplinaSemestre: '3', cursoNome: 'Sistemas' },
    ];
  }

  public getSalas(): SalaOpcao[] {
    // Retorna dados simulados que funcionam tanto como Sala completa quanto simplificada
    return [
      { salaId: 101, salaNome: 'Sala 101 (Térreo)', capacidade: 40 },
      { salaId: 202, salaNome: 'Lab. Química', capacidade: 20 },
      { salaId: 305, salaNome: 'Auditório Principal', capacidade: 100 },
    ];
  }

  public getHorariosDisponiveisPorData(data: string): Observable<JanelaHorario[]> {
    const baseHorarios: JanelaHorario[] = [
      { janelasHorarioId: 1, horaInicio: '07:40', horaFim: '09:20' },
      { janelasHorarioId: 2, horaInicio: '09:40', horaFim: '11:20' },
      { janelasHorarioId: 3, horaInicio: '13:00', horaFim: '14:40' },
      { janelasHorarioId: 4, horaInicio: '15:00', horaFim: '16:40' },
    ];

    let horariosFiltrados = [...baseHorarios];

    // Simulação: Datas terminadas em 0 ou 5 têm poucos horários
    if (data.endsWith('0') || data.endsWith('5')) {
      horariosFiltrados = horariosFiltrados.slice(0, 2); // Só manhã
      console.log(`Mock: Poucos horários para ${data}`);
    } else {
      console.log(`Mock: Horários completos para ${data}`);
    }

    return of(horariosFiltrados).pipe(delay(600)); // Delay para ver o loading
  }
}
