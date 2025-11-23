import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Datas, JanelaHorario } from '../../models/janelasHorario.model';
import type { Observable } from 'rxjs';
import type { AtualizarJanelaHorarioRequest, CriarJanelaHorarioRequest } from '../../types/janelaHorario.type';

@Injectable({
  providedIn: 'root'
})
export class JanelasHorarioService {  
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + "/janelas-horario";



  public getJanelaHorarioPorId(janelaHorarioId: number): Observable<JanelaHorario>{
    return this.http.get<JanelaHorario>(`${this.baseUrl}/${janelaHorarioId}`)
  }

  public editJanelaHorarioPorId(janelaHorarioId: number, janelaHorario: AtualizarJanelaHorarioRequest): Observable<JanelaHorario>{
    return this.http.put<JanelaHorario>(`${this.baseUrl}/${janelaHorarioId}`, janelaHorario)
  }

  public getJanelasHorario(): Observable<JanelaHorario[]>{
    return this.http.get<JanelaHorario[]>(this.baseUrl)
  }

  public criarJanelaHorario(janelaHorario: CriarJanelaHorarioRequest): Observable<JanelaHorario>{
    return this.http.post<JanelaHorario>(`${this.baseUrl}`, janelaHorario)
  } 

  public getJanelaHorarioPorData(data: string): Observable<JanelaHorario[]>{
    return this.http.get<JanelaHorario[]>(`${this.baseUrl}/disponiveis/${data}`)
  }

  public postJanelasHorarioPorDatas(datas: Datas): Observable<JanelaHorario[]>{
    return this.http.post<JanelaHorario[]>(`${this.baseUrl}/disponiveis/datas`, datas);
  }

}
