import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { TipoRecurso } from '../../models/tipoRecurso.modal';
import type { Observable } from 'rxjs';
import type { AtualizarTipoRecursoRequest, CriarTipoRecursoRequest } from '../../types/tipoRecurso.type';

@Injectable({
  providedIn: 'root'
})
export class TipoRecursoService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl + "/tipo-recurso"


  public getTipoRecursoPorId(tipoRecursoId: number): Observable<TipoRecurso>{
    return this.http.get<TipoRecurso>(`${this.baseUrl}/${tipoRecursoId}`);
  }

  public editTipoRecursoPorId(tipoRecursoId: number, tipoRecurso: AtualizarTipoRecursoRequest): Observable<TipoRecurso>{
    return this.http.put<TipoRecurso>(`${this.baseUrl}/${tipoRecursoId}`, tipoRecurso);
  }

  public deleteTipoRecursoPorId(tipoRecursoId: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${tipoRecursoId}`);
  }

  public getTipoRecurso(): Observable<TipoRecurso[]>{
    return this.http.get<TipoRecurso[]>(this.baseUrl)
  }

  public createTipoRecurso(TipoRecurso: CriarTipoRecursoRequest): Observable<TipoRecurso>{
    return this.http.post<TipoRecurso>(this.baseUrl, TipoRecurso)
  }
}
