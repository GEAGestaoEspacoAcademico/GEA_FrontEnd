import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { Disciplina } from '../../models/disciplina.model';
import type { Professor } from '../../models/professor.model';
import type { AtualizarProfessorRequest, BuscarCursosProfessorResponse, CriarProfessorRequest } from '../../types/professor.types';

@Injectable({
  providedIn: 'root'
})
export default class ProfessorService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + "/professores";

  public getProfessorPorId(idProfessor: number): Observable<Professor>{
    return this.http.get<Professor>(`${this.baseUrl}/${idProfessor}`);
  }

  public editProfessor(idProfessor: number, professor: Professor): Observable<Professor>{
    return this.http.put<Professor>(`${this.baseUrl}/${idProfessor}`, professor);
  }

  public getProfessores(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.baseUrl);
  }

  public criarProfessor(professor: CriarProfessorRequest): Observable<Professor>{
    return this.http.post<Professor>(this.baseUrl, professor)
  }

  public getDisciplinasDoProfessor(idProfessor: number): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(`${this.baseUrl}/${idProfessor}/disciplinas`);
  }

  public getCursosDoProfessor(idProfessor: number): Observable<BuscarCursosProfessorResponse[]>{
    return this.http.get<BuscarCursosProfessorResponse[]>(`${this.baseUrl}/${idProfessor}/cursos`)
  }

  public deleteProfessor(idProfessor: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${idProfessor}`)
  }

  public editarProfessor(id: number, dadosProfessor: AtualizarProfessorRequest): Observable<Professor> {
    return this.http.put<Professor>(`${this.baseUrl}/${id}`, dadosProfessor);
  }
}
