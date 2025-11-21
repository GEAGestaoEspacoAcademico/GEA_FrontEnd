import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Sala } from '../../models/sala.model';
import { environment } from '../../../environments/environment';
import { FormatUtils } from '../../utils/format.utils';
import type { RecomendacaoRequest, Recomendacoes } from '../../types/recomendacao';
import type { CriarSala } from '../../types/criarsala';
/**
 * Serviço responsável pelo CRUD e gerenciamento de salas
 */
@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl + "/salas"
  
  /**
   * Busca todas as salas contidas no banco de dados
   * @returns Retorna um observable contendo um array de objetos Sala
   */
  public getSalas(): Observable<Sala[]>{
    return this.http.get<Sala[]>(this.baseUrl);
  }

  public getSalaId(salaId: number): Observable<Sala>{
    return this.http.get<Sala>(`${this.baseUrl}/${salaId}`)
  }

  public getRecomendacao(data: RecomendacaoRequest): Observable<Recomendacoes[]>{
    data.horarios.horaFim = FormatUtils.colocarSegundos(data.horarios.horaFim)
    data.horarios.horaInicio = FormatUtils.colocarSegundos(data.horarios.horaInicio)
    return this.http.post<Recomendacoes[]>(`${this.baseUrl}/recomendacoes`, data)
  }

  deleteSala(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  createSala(payload: CriarSala) {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  updateSala(id: number, payload: CriarSala) {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }
}
