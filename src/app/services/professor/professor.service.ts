import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { Disciplina } from '../../models/disciplina.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/professores";

  public getDisciplinasPorId(idProfessor: number): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(`${this.baseUrl}/${idProfessor}/disciplinas`);
  }
}
