import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Agendamento, EditAgendamento } from '../../models/agendamento.model';
import { environment } from '../../../environments/environment';

/**
 * Serviço responsável pelo CRUD e gerenciamento de Agendamentos
 */
@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl + "/agendamentos/aulas";

  /**
   * Busca um agendamento especifico através de seu ID
   * @param id Id númerico do agendamento
   * @returns Um observable que contem o objeto Agendamento especificado pelo id
   */
  public getAgendamentoById(id:number): Observable<Agendamento> {
    return this.http.get<Agendamento>(`${this.baseUrl}/${id}`);
  }

  /**
   * Busca todos os agendamentos por um professor
   * @param id Id número do professor
   * @returns Retorna um observable que contém um array de objetos Agendamento 
   */
  public getAgendamentosProfessor(id:number): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(`${this.baseUrl}/professor/${id}`);
  }

  /**
   * Deleta um agendamento do banco de dados através do ID
   * @param id Id número do agendamento
   * @returns Retorna um observable contendo nada
   */
  public deleteAgendamento(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
  }


/**
 * 
 * @param id Id numérico do Agendamento
 * @param agendamento Objeto do Tipo EditAgendamento contendo os novos dados do agendamento
 * @returns Retorna um observable contendo o objeto Agendamento atualizado
 */
  public editAgendamento(id:number, agendamento: EditAgendamento): Observable<Agendamento>{
    return this.http.put<Agendamento>(`${this.baseUrl}/${id}`, agendamento)
  }

}
