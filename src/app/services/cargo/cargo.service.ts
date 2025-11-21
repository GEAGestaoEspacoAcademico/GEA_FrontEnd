import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type { Cargo } from '../../models/cargo.model';
import type { CriarCargoRequest } from '../../types/cargo.type';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/cargos";

  public getCargos(): Observable<Cargo[]>{
    return this.http.get<Cargo[]>(this.baseUrl);
  }

  public criarCargo(cargo: CriarCargoRequest): Observable<Cargo> {
    return this.http.post<Cargo>(this.baseUrl, cargo)
  }

  // public pegarCargoUsuario

  // public pegarCargoAdmin

}
