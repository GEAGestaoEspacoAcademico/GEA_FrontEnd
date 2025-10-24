import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Disciplina } from '../../models/disciplina.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/disciplinas";

  public getDisciplinas(): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(this.baseUrl);
  }

  public getDisciplinaProfessor(idProfessor: number): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(`${this.baseUrl}/professor/${idProfessor}`);
  }

}
