import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { LoginRequest } from './types';
import type { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private baseUrl = "http://localhost:8080/auth";

  public loginUser(request: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, request)
  }

}
