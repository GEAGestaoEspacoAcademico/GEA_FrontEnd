import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { Recurso } from '../../models/Recurso.model';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/recursos";

  public getRecursos(): Observable<Recurso[]>{
    return this.http.get<Recurso[]>(this.baseUrl);
  }
}
