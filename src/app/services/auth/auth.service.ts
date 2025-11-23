import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { AuthLoginRequest, AuthLoginResponse } from '../../types/authLogin.type';
import { environment } from '../../../environments/environment';
import type { AuthRegisterRequest, AuthRegisterResponse } from '../../types/authRegjster.type';
/**
 * Serviço responsável pelas ações de autenticação do usuário
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "/auth";

  public logarUsuario(dadosUsuario: AuthLoginRequest): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(`${this.baseUrl}/login`, dadosUsuario)
  }

  public registrarUsuario(usuario: AuthRegisterRequest): Observable<AuthRegisterResponse> {
    return this.http.post<AuthRegisterResponse>(`${this.baseUrl}/register`, usuario);
  }
}
