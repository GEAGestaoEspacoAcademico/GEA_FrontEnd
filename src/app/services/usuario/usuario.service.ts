import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { Observable } from 'rxjs';
import type {
  AlterarSenhaUsuarioRequest,
  AtualizarUsuarioAdminResquest,
  GetUsuarioResponse,
} from '../../types/usuario.type';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/usuarios';

  public listarUsuarios(): Observable<GetUsuarioResponse[]> {
    return this.http.get<GetUsuarioResponse[]>(this.baseUrl);
  }

  public buscarUsuarioPorId(usuarioId: number): Observable<GetUsuarioResponse> {
    return this.http.get<GetUsuarioResponse>(`${this.baseUrl}/${usuarioId}`);
  }

  public atualizarUsuarioAdmin(
    usuarioId: number,
    requisicao: AtualizarUsuarioAdminResquest,
  ): Observable<void> {
    console.log('ATUALIZANDO USUARIO', requisicao);
    return this.http.patch<void>(`${this.baseUrl}/${usuarioId}`, requisicao);
  }

  public alterarSenha(usuarioId: number, requisicao: AlterarSenhaUsuarioRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${usuarioId}/senha`, requisicao);
  }

  public deletar(usuarioId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${usuarioId}`);
  }
}
