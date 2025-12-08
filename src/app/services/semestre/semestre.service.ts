import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { Semestre } from '../../models/semestre.model';

@Injectable({
  providedIn: 'root',
})
export class SemestreService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/semestres';

  public listarTodos(): Observable<Semestre[]> {
    return this.http.get<Semestre[]>(this.baseUrl);
  }
}
