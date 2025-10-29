import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Disciplina } from '../../models/disciplina.model';
import { environment } from '../../../environments/environment';
/**
 * Serviço responsável pelo CRUD e gerenciamento de Disciplina
 */
@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/disciplinas";

  /**
   * Busca todas as disciplinas contidas no banco de dados
   * @returns Retorna um observable contendo um array de objetos Disciplina
   */
  public getDisciplinas(): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(this.baseUrl);
  }

  /**
   * Pega todas as disciplinas em que um professor está relacionado
   * @param idProfessor Id númerico do Professor
   * @returns Retorna um observable contendo um array de objetos Disciplina relacionadas ao professor
   */
  public getDisciplinaProfessor(idProfessor: number): Observable<Disciplina[]>{
    return this.http.get<Disciplina[]>(`${this.baseUrl}/professor/${idProfessor}`);
  }

}
