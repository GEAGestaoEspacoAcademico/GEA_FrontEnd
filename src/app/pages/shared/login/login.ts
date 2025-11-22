import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthActions } from '../../../store/auth/auth.actions';
import type { AuthLoginRequest } from '../../../types/authLogin.type';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';
import { selectAuthError, selectAuthIsLoading } from '../../../store/auth/auth.selectors';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  private store = inject(Store)
  error$!: Observable<string | null>;
  loading$: Observable<boolean | null> = this.store.select(selectAuthIsLoading);

  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  hidePassword: boolean = false;
  btnVisibility: boolean = false;

  ngOnInit(): void {
    this.loginForm.get('password')?.valueChanges.subscribe(value => {
      this.btnVisibility = !!(value && value.trim().length > 0);
    });
    this.error$ = this.store.select(selectAuthError);
    this.loginForm.reset();
  }

  fetchUser(){
    const username = this.loginForm.get('user')?.value?.trim()
    const password = this.loginForm.get('password')?.value?.trim()

    if(!username || !password){
      this.loginForm.reset();
      this.loginForm.setErrors({ infoInvalid: true });
      return;
    }

    const AuthLoginRequest: AuthLoginRequest = {
      usuarioLogin: username,
      usuarioSenha: password
    }
    
    this.store.dispatch(AuthActions.login({ AuthLoginRequest }));
  }


  changeVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    this.fetchUser();
  }
}
