import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { TiposSalas } from '../../models/tipoSala.mode';

@Injectable({
  providedIn: 'root'
})
export class TipoSalaService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl + "/tipos-salas"


  public getTiposSalas(): Observable<TiposSalas[]>{
    return this.http.get<TiposSalas[]>(this.baseUrl)
  }
}
