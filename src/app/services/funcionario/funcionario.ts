import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Funcionario } from '../../models/funcionario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/funcionarios';

  getFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.baseUrl);
  }

  getFuncionarioById(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.baseUrl}/${id}`);
  }

  createFuncionario(data: Funcionario): Observable<void> {
    return this.http.post<void>(this.baseUrl, data);
  }

  updateFuncionario(id: number, data: Funcionario): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  deleteFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
