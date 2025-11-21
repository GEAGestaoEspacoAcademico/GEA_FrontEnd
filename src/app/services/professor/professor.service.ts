import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { Disciplina } from '../../models/disciplina.model';
import type { CursoProfesor } from '../../types/curso';
import type { Professor } from '../../types/funcionario';

@Injectable({
  providedIn: 'root'
})
export default class ProfessorService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + "/professores";

  public getDisciplinasDoProfessor(idProfessor: number): Observable<Disciplina[]> {
    return this.http.get<Disciplina[]>(`${this.baseUrl}/${idProfessor}/disciplinas`);
  }

  public getCursosDoProfessor(idProfessor: number): Observable<CursoProfesor[]> {
    return this.http.get<CursoProfesor[]>(`${this.baseUrl}/${idProfessor}/cursos`)
  }

  public getById(idProfessor: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.baseUrl}/${idProfessor}`);
  }

  public editarProfessor(id: number, dadosProfessor: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dadosProfessor);
  }

}