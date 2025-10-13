import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  hidePassword: boolean = false;
  btnVisibility: boolean = false;

  userTest: string = "Felipe Santos";
  passwordTest: string = "123456";

  ngOnInit(): void {
    this.loginForm.get('password')?.valueChanges.subscribe(value => {
      this.btnVisibility = !!(value && value.trim().length > 0);
    });
  }

  changeVisibility() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, eqeqeq
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid && this.loginForm.get('user')?.value !== this.userTest || this.loginForm.get('password')?.value !== this.passwordTest) {
      this.loginForm.reset();
      this.loginForm.setErrors({ infoInvalid: true });

      //Aqui seria a validação do AuthService.login
      return;
    }

    //Aqui seria o codigo para a troca de rota
    //this.router.navigate([/aulas])
  }
}
