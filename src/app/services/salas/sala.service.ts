import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Sala } from '../../models/sala.model';

@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private http = inject(HttpClient)
  private baseUrl = "http://localhost:8080/salas"
  
  public getSalas(): Observable<Sala[]>{
    return this.http.get<Sala[]>(this.baseUrl);
  }
}
