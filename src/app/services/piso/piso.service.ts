import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Piso } from '../../models/piso';

@Injectable({
  providedIn: 'root',
})
export class PisoService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + '/pisos';

  listar(): Observable<Piso[]> {
    return this.http.get<Piso[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Piso> {
    return this.http.get<Piso>(`${this.baseUrl}/${id}`);
  }
}
