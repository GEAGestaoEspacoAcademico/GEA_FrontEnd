import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Curso } from '../../models/curso.model';
import { environment } from '../../../environments/environment';
import type { AtualizarCursoRequest, CriarCursoRequest } from '../../types/curso';
/**
 * Serviço responsável pelo CRUD e gerenciamento de Crusos
 */
@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl + '/cursos';

  public getCursosPorId(cursoId: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/${cursoId}`);
  }

  public editCurso(cursoId: number, curso: AtualizarCursoRequest): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseUrl}/${cursoId}`, curso);
  }

  public deleteCurso(cursoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${cursoId}`);
  }

  public getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.baseUrl);
  }

  public criarCurso(curso: CriarCursoRequest): Observable<Curso> {
    return this.http.post<Curso>(this.baseUrl, curso);
  }
}
