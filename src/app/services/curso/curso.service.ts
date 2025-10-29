import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Curso } from '../../models/curso.model';
import { environment } from '../../../environments/environment';
/**
 * Serviço responsável pelo CRUD e gerenciamento de Crusos
 */
@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/cursos";

  /**
   * Busca todos os Cursos no banco de dados
   * @returns Retorna um observable contendo um array de objetos Curso
   */
  public getCursos(): Observable<Curso[]>{
    return this.http.get<Curso[]>(this.baseUrl);
  }
  
}
