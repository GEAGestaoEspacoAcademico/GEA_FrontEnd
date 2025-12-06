import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { AuxiliarDocente, CriarAuxiliarDocenteRequest } from '../../models/auxiliarDocente.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuxiliarDocenteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  criar(dados: CriarAuxiliarDocenteRequest): Observable<AuxiliarDocente> {
    return this.http.post<AuxiliarDocente>(`${this.baseUrl}/auxiliar-docentes`, dados);
  }
}
