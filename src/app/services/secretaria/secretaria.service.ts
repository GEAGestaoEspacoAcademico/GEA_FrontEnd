import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Secretaria } from '../../models/secretaria.model';
import type {
  AtualizarSecretariaResquest,
  CriarSecretariaRequest,
} from '../../types/secretaria.type';

@Injectable({
  providedIn: 'root',
})
export class SecretariaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/secretaria';

  public listar(): Observable<Secretaria[]> {
    return this.http.get<Secretaria[]>(this.baseUrl);
  }

  public buscarPorId(id: number): Observable<Secretaria> {
    return this.http.get<Secretaria>(`${this.baseUrl}/${id}`);
  }

  public cadastrar(requisicao: CriarSecretariaRequest): Observable<Secretaria> {
    return this.http.post<Secretaria>(this.baseUrl, requisicao);
  }

  public atualizar(id: number, requisicao: AtualizarSecretariaResquest): Observable<Secretaria> {
    return this.http.put<Secretaria>(`${this.baseUrl}/${id}`, requisicao);
  }

  public deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
