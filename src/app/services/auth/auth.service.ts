import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { User } from '../../models/user.model';
import type { UserCredencials } from '../../types/auth.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  private baseUrl = environment.apiUrl + "auth";

  public loginUser(request: UserCredencials): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, request)
  }

}
