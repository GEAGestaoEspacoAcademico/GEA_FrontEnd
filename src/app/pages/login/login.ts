import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AuthActions } from '../../store/auth/auth.actions';
import type { UserCredencials } from '../../types/auth.type';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  private router = inject(Router);
  private authService = inject(AuthService)
  private store = inject(Store)
  
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  hidePassword: boolean = false;
  btnVisibility: boolean = false;

  userTest: string = "felipenascimento@gmail.com";
  passwordTest: string = "123456";

  ngOnInit(): void {
    this.loginForm.get('password')?.valueChanges.subscribe(value => {
      this.btnVisibility = !!(value && value.trim().length > 0);
    });
  }

  fetchUser(){
    const username = this.loginForm.get('user')?.value?.trim()
    const password = this.loginForm.get('password')?.value?.trim()

    if(!username || !password){
      this.loginForm.reset();
      this.loginForm.setErrors({ infoInvalid: true });
      return;
    }

    const userCredencials: UserCredencials = {
      login: username,
      senha: password
    }
    this.store.dispatch(AuthActions.login({ userCredencials }));
  }


  changeVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    this.fetchUser();
  }
}
