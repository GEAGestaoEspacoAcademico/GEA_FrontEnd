import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  private router = inject(Router);
  
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

  changeVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid && this.loginForm.get('user')?.value !== this.userTest || this.loginForm.get('password')?.value !== this.passwordTest) {
      this.loginForm.reset();
      this.loginForm.setErrors({ infoInvalid: true });

      //Aqui seria a validação do AuthService.login
      return;
    }

    this.router.navigate(['/aulas']);
  }
}
