import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { JanelaHorario } from '../../models/janelasHorario.model';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JanelasHorarioService {  
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + "/janelas-horario";


  public getJanelasHorario(): Observable<JanelaHorario[]>{
    return this.http.get<JanelaHorario[]>(this.baseUrl)
  }

  public getHorariosDisponiveisPorData(data: string): Observable<JanelaHorario[]> {    
    const urlCompleta = `${this.baseUrl}/disponiveis/${data}`;
    return this.http.get<JanelaHorario[]>(urlCompleta);
  }
}
