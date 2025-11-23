import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Disciplina } from '../../models/disciplina.model';
import { environment } from '../../../environments/environment';
import type { AtualizarDisciplinaRequest, CriarDisciplinaRequest } from '../../types/disciplina.model';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/disciplinas";

  public getDisciplinaPorId(disciplinaId: number): Observable<Disciplina>{
    return this.http.get<Disciplina>(`${this.baseUrl}/${disciplinaId}`);
  }

  public editDisciplina(disciplinaId: number, disciplina: AtualizarDisciplinaRequest): Observable<Disciplina>{
    return this.http.put<Disciplina>(`${this.baseUrl}/${disciplinaId}`, disciplina)
  }

  public deleteDisciplina(disciplinaId: number): Observable<void>{
    return this.http.get<void>(`${this.baseUrl}/${disciplinaId}`);
  }

  public getDisciplinas(): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(this.baseUrl);
  }

  public criarDisciplina(disciplina: CriarDisciplinaRequest): Observable<Disciplina>{
    return this.http.post<Disciplina>(`${this.baseUrl}`, disciplina);
  } 

}
