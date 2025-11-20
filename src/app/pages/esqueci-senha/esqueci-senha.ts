import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-esqueci-senha',
  standalone: false,
  templateUrl: './esqueci-senha.html',
  styleUrl: './esqueci-senha.css',
})
export class EsqueciSenha implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly snackbarService = inject(SnackBarService);
  private readonly router = inject(Router);

  token!: string | null;
  isLoading: boolean = false;
  isEmailSucess: boolean = false;

  formEmail = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  senhasIguais: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const novaSenha = control.get('novaSenha');
    const novaSenhaRepetida = control.get('novaSenhaRepetida');

    if (!novaSenha || !novaSenhaRepetida) {
      return null;
    }

    if (novaSenha.value === novaSenhaRepetida.value) {
      novaSenhaRepetida.setErrors(null);
      return null;
    }

    const error = { passwordMismatch: true };
    novaSenhaRepetida.setErrors(error);
    return error;
  };

  formRedefinirSenha = new FormGroup(
    {
      novaSenha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      novaSenhaRepetida: new FormControl('', [Validators.required]),
    },
    {
      validators: this.senhasIguais,
    },
  );

  ngOnInit(): void {
    this.formEmail.reset();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'] || null;

      if (this.token) {
        this.formRedefinirSenha.reset();
      }
    });
  }

  async enviarEmail() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.isEmailSucess = true;
    this.isLoading = false;

    const email = this.formEmail.get('email')?.value?.trim();

    //chama serviço de email

    this.isEmailSucess = true;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.router.navigate(['/esqueci-senha'], {
      queryParams: { token: 'teste' },
    });

    this.isEmailSucess = false;
  }

  async alterarSenha() {
    const novaSenha = this.formRedefinirSenha.get('novaSenha')?.value?.trim();
    const novaSenhaRepetida = this.formRedefinirSenha.get('novaSenhaRepetida')?.value?.trim();

    //chama service redefinir senha

    this.snackbarService.showSuccess('Senha alterada com sucesso!');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.router.navigate(['/login']);
  }

  validarEmail() {
    if (this.formEmail.valid) {
      this.isLoading = true;
      this.enviarEmail();
    }
  }

  validarSenhas() {
    if (this.formRedefinirSenha.valid) {
      this.alterarSenha();
    }
  }
}
