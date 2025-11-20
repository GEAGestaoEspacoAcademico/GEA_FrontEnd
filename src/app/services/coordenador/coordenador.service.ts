import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { Coordenador } from '../../models/coordenador.model';
import type { CriarCoordenadorRequest, CriarCoordenadorResponse } from '../../types/coordenador.type';

@Injectable({
  providedIn: 'root'
})
export class CoordenadorService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/coordenadores";

  public getCoordenadores(): Observable<Coordenador[]> {
    return this.http.get<Coordenador[]>(this.baseUrl)
  }

  public criarCoordenador(coordenador: CriarCoordenadorRequest): Observable<CriarCoordenadorResponse> {
    return this.http.post<CriarCoordenadorResponse>(this.baseUrl, coordenador)
  }

  public getCoordenadorPorId(coordenadorId: number): Observable<Coordenador>{
    return this.http.get<Coordenador>(`${this.baseUrl}/${coordenadorId}`);
  }

  public deleteCoordenador(coordenadorId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${coordenadorId}`)
  }

  public getCoordenadorPorRegistro(coordenadorRegistro: number): Observable<Coordenador> {
    return this.http.get<Coordenador>(`${this.baseUrl}/registro/${coordenadorRegistro}`)
  }
}
