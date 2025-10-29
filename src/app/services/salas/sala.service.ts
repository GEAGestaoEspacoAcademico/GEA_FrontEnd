import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Sala } from '../../models/sala.model';
import { environment } from '../../../environments/environment';
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
}
