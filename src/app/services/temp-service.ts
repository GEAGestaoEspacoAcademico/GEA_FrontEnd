import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Usuario } from '../types/usuario';
import type { AD } from '../types/ad';


@Injectable({
  providedIn: 'root',
})
export class TempService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + "/usuarios";

  public getById(usuarioId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${usuarioId}`);
  }

  public atualizarAD(id: number, dadosAd: any): Observable<AD> {
    return this.http.put<AD>(`${this.baseUrl}/${id}`, dadosAd);
  }
}
