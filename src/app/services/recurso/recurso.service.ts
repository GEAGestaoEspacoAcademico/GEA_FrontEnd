import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { AtualizarRecursoRequest } from '../../types/recurso.type';
import type { Recurso } from '../../models/Recurso.model';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl + "/recursos";

  public getRecursoPorId(recursoId: number): Observable<Recurso>{
    return this.http.get<Recurso>(`${this.baseUrl}/${recursoId}`)
  }

  public editRecurso(recursoId: number, recurso: AtualizarRecursoRequest): Observable<Recurso>{
    return this.http.put<Recurso>(`${this.baseUrl}/${recursoId}`, recurso)
  }

  public deleteRecurso(recursoId: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${recursoId}`)
  }

  public getRecursos(): Observable<Recurso[]>{
    return this.http.get<Recurso[]>(this.baseUrl);
  }

  public criarRecurso(recurso: AtualizarRecursoRequest): Observable<Recurso>{
    return this.http.post<Recurso>(this.baseUrl, recurso)
  }

  public getRecursoPorTipo(tipoId: number): Observable<Recurso>{
    return this.http.get<Recurso>(`${this.baseUrl}/tipo/${tipoId}`)
  }
}
