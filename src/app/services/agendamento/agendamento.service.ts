import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AgendamentoAula } from '../../models/agendamentoAula.model';
import type { AgendamentoAulaCriarADReponse, AgendamentoAulaCriarADRequest, AgendamentoAulaCriarRequest, AgendamentoAulaEditarRequest } from '../../types/agendamentoAula.type';
import type { Agendamento } from '../../models/agendamento.model';
import type { AgendamentoEvento } from '../../models/agendamentoEvento.model';
import type { AgendamentoRecorrente } from '../../models/agendamentoRecorrente.model';
import type { CriarEventoRequest} from '../../types/agendamentoEvento.type';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/agendamentos';

  //AULA
  public getAgendamentoAulaPorId(agendamentoAulaId: number): Observable<AgendamentoAula>{
    return this.http.get<AgendamentoAula>(`${this.baseUrl}/aulas/${agendamentoAulaId}`)
  }

  public editAgendamentoAula(agendamentoAulaId: number, agendamento: AgendamentoAulaEditarRequest): Observable<Agendamento> {
    return this.http.put<Agendamento>(`${this.baseUrl}/aulas/${agendamentoAulaId}`, agendamento);
  }

  public deleteAgendamentoAula(agendamentoAulaId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/aulas/${agendamentoAulaId}`);
  }

  public getAgendamentoAula(): Observable<AgendamentoAula[]>{
    return this.http.get<AgendamentoAula[]>(`${this.baseUrl}/aulas`)
  }

  public criarAgendamentoAula(agendamento: AgendamentoAulaCriarRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/aulas`, agendamento);
  }

  public criarAgendamentoAulaAD(agendamento: AgendamentoAulaCriarADRequest): Observable<AgendamentoAulaCriarADReponse>{
    return this.http.post<AgendamentoAulaCriarADReponse>(`${this.baseUrl}/aulas/auxiliar-docente`, agendamento);
  }

  public criarAgendamentoAulaRecorrente(agendamento: AgendamentoRecorrente): Observable<AgendamentoRecorrente>{
    return this.http.post<AgendamentoRecorrente>(`${this.baseUrl}/aulas/recorrencia`, agendamento);
  }

  public getAgendamentos(): Observable<Agendamento[]>{
    return this.http.get<Agendamento[]>(this.baseUrl);
  }

  public getAgendamentoPorData(data: string): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.baseUrl}/${data}`);
  }

  public getAgendamentosPorfessor(professorId: number): Observable<AgendamentoAula[]> {
    return this.http.get<AgendamentoAula[]>(`${this.baseUrl}/aulas/professor/${professorId}`);
  }

  //EVENTO

  public getAgendamentosEvento(): Observable<AgendamentoEvento[]>{
    return this.http.get<AgendamentoEvento[]>(`${this.baseUrl}/eventos`);
  }

  public criarAgendamentoEvento(agendamentoEvento: CriarEventoRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/eventos`, agendamentoEvento);
  }
}
