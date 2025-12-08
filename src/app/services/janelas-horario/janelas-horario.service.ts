import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Datas, JanelaHorario } from '../../models/janelasHorario.model';
import type { Observable } from 'rxjs';
import type {
  AtualizarJanelaHorarioRequest,
  CriarJanelaHorarioRequest,
  JanelasHorarioPorDataRequest,
} from '../../types/janelaHorario.type';

@Injectable({
  providedIn: 'root',
})
export class JanelasHorarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/janelas-horario';

  public getJanelaHorarioPorId(janelaHorarioId: number): Observable<JanelaHorario> {
    return this.http.get<JanelaHorario>(`${this.baseUrl}/${janelaHorarioId}`);
  }

  public editJanelaHorarioPorId(
    janelaHorarioId: number,
    janelaHorario: AtualizarJanelaHorarioRequest,
  ): Observable<JanelaHorario> {
    return this.http.put<JanelaHorario>(`${this.baseUrl}/${janelaHorarioId}`, janelaHorario);
  }

  public getJanelasHorario(): Observable<JanelaHorario[]> {
    return this.http.get<JanelaHorario[]>(this.baseUrl);
  }

  public criarJanelaHorario(janelaHorario: CriarJanelaHorarioRequest): Observable<JanelaHorario> {
    return this.http.post<JanelaHorario>(`${this.baseUrl}`, janelaHorario);
  }

  public getJanelaHorarioPorData(
    requisicao: JanelasHorarioPorDataRequest,
  ): Observable<JanelaHorario[]> {
    return this.http.post<JanelaHorario[]>(`${this.baseUrl}/disponiveis`, requisicao);
  }

  public postJanelasHorarioPorDatas(datas: Datas): Observable<JanelaHorario[]> {
    return this.http.post<JanelaHorario[]>(`${this.baseUrl}/disponiveis/datas`, datas);
  }
}
