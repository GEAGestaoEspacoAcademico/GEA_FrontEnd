import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';
import type { Sala } from '../../models/sala.model';
import { environment } from '../../../environments/environment';
import { FormatUtils } from '../../utils/format.utils';
import type { AdicionarRecursoSalaRequest, AdicionarRecursoSalaResponse, AtualizarSalaRequest, AtulizarQuantidadeRecursoSalaRequest, BuscarRecomendacaoRequest, BuscarRecomendacaoResponse, BuscarRecursoSalaResponse, BuscarSalaDisponivel, CriarSalaRequest, CriarSalaResponse } from '../../types/sala.type';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl + "/salas"

  public getSalaPorId(salaId: number): Observable<Sala>{
    return this.http.get<Sala>(`${this.baseUrl}/${salaId}`)
  }

  public editSala(salaId: number, sala: AtualizarSalaRequest): Observable<Sala>{
    return this.http.put<Sala>(`${this.baseUrl}/${salaId}`, sala)
  }

  public deleteSala(salaId: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${salaId}`)
  }

  public editQuantidadeRecursoSala(salaId: number, recursoId: number, recurso: AtulizarQuantidadeRecursoSalaRequest ): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${salaId}/recursos/${recursoId}`, recurso)
  }

  public deleteRecursoSala(salaId: number, recursoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${salaId}/recursos/${recursoId}`)
  }

  public getSalas(): Observable<Sala[]>{
    return this.http.get<Sala[]>(this.baseUrl);
  }

  public criarSala(sala: CriarSalaRequest): Observable<CriarSalaResponse>{
    return this.http.post<CriarSalaResponse>(this.baseUrl, sala)
  }

  public getRecursosSalaPorId(salaid: number): Observable<BuscarRecursoSalaResponse>{
    return this.http.get<BuscarRecursoSalaResponse>(`${this.baseUrl}/${salaid}/recursos`)
  }

  public adicionarRecursoEmSala(salaId: number, recurso: AdicionarRecursoSalaRequest): Observable<AdicionarRecursoSalaResponse>{
    return this.http.post<AdicionarRecursoSalaResponse>(`${this.baseUrl}/${salaId}/recursos`, recurso)
  }

  public getRecomendacao(data: BuscarRecomendacaoRequest): Observable<BuscarRecomendacaoResponse>{
    data.horarios.horaFim = FormatUtils.colocarSegundos(data.horarios.horaFim)
    data.horarios.horaInicio = FormatUtils.colocarSegundos(data.horarios.horaInicio)
    return this.http.post<BuscarRecomendacaoResponse>(`${this.baseUrl}/recomendacoes`, data)
  }

  public getSalaDisponivel(): Observable<BuscarSalaDisponivel[]>{
    return this.http.get<BuscarSalaDisponivel[]>(`${this.baseUrl}/disponiveis`)
  }

  //!MÉTODO TEMPORARIO SUJEITO A MUIDANÇAS
  public getLaboratorios(): Observable<Sala[]> {
    return this.http.get<Sala[]>(this.baseUrl).pipe(
      map((salas: Sala[]) => salas.filter(s => this.isLaboratorio(s)))
    );
  }

  private isLaboratorio(s: Sala): boolean {
    const textFields: string[] = [
      s.salaNome ?? '',
    ];
    const combined = textFields.join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const keywords = [
      'lab',
      'laboratorio',
      'laboratório',
      'maker',
      'mecatron',
      'informatic',
      'comput',
      'lab.'
    ];

    return keywords.some(k => combined.includes(k));
  }

}
