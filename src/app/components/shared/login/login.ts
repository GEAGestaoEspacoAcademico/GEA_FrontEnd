import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
    loginForm = new FormGroup({
      user: new FormControl(''),
      password: new FormControl('')
    });
}
