import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Disciplina } from '../../models/disciplina.model';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private http = inject(HttpClient);
  
  private baseUrl = "http://localhost:8080/disciplinas";

  public getDisciplinas(): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(this.baseUrl);
  }

  public getDisciplinaProfessor(idProfessor: number): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(`${this.baseUrl}/professor/${idProfessor}`);
  }

}
