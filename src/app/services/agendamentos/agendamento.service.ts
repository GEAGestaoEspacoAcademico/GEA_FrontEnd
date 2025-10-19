import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Agendamento, EditAgendamento } from '../../models/agendamento.model';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private http = inject(HttpClient)
  private baseUrl = "http://localhost:8080/agendamentos/aulas";

  public getAgendamentoById(id:number): Observable<Agendamento> {
    return this.http.get<Agendamento>(`${this.baseUrl}/${id}`);
  }

  public getAgendamentosProfessor(id:number): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.baseUrl}/professor/${id}`);
  }

  public deleteAgendamento(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
  }

  public editAgendamento(id:number, agendamento: EditAgendamento): Observable<Agendamento>{
    return this.http.post<Agendamento>(this.baseUrl, agendamento)
  }

}
