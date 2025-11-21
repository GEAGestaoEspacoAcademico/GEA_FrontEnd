import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { TipoSala } from '../../models/tipoSala.mode';
import type { CriarTipoSalaRequest } from '../../types/tipoSala.type';
import type { AtualizarTipoRecursoRequest } from '../../types/tipoRecurso.type';

@Injectable({
  providedIn: 'root'
})
export class TipoSalaService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl + "/tipos-salas"


  public getTipoSalaPorId(tipoSalaId: number): Observable<TipoSala>{
    return this.http.get<TipoSala>(`${this.baseUrl}/${tipoSalaId}`);
  }
  
  public editTipoSalaPorId(tipoSalaId: number, tipoRecurso: AtualizarTipoRecursoRequest): Observable<TipoSala>{
    return this.http.put<TipoSala>(`${this.baseUrl}/${tipoSalaId}`, tipoRecurso);
  }
  
  public deleteTipoSalaPorId(tipoSalaId: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${tipoSalaId}`);
  }
  
  public getTiposSala(): Observable<TipoSala[]>{
    return this.http.get<TipoSala[]>(this.baseUrl)
  }

  public createTipoSala(tipoSala: CriarTipoSalaRequest): Observable<TipoSala>{
    return this.http.post<TipoSala>(this.baseUrl, tipoSala)
  }


}
