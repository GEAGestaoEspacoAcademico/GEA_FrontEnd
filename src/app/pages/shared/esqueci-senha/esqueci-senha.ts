import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { Location } from '@angular/common';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import type { AlterarSenhaEsquecidaRequest, EnviarEmailRequest } from '../../../types/usuario.type';

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
  private readonly location = inject(Location);
  private readonly usuarioService = inject(UsuarioService);

  token!: string | null;
  isLoading: boolean = false;
  isEmailSucess: boolean = false;
  isRedefinirSenhaSucess: boolean = false;

  hideNewPassword = false;
  hideRepeatPassword = false;

  btnNewVisibility = false;
  btnRepeatVisibility = false;

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
    this.activatedRoute.queryParams.subscribe((params) => {
      this.token = params['token'] || null;

      if (this.token) {
        this.formRedefinirSenha.reset();    
        this.setupPasswordObservers();
      } else {
        this.formEmail.reset();
      }
    });
  }

  setupPasswordObservers() {
    this.formRedefinirSenha.get('novaSenha')?.valueChanges.subscribe(value => {
      this.btnNewVisibility = !!(value && value.trim().length > 0);
    });

    this.formRedefinirSenha.get('novaSenhaRepetida')?.valueChanges.subscribe(value => {
      this.btnRepeatVisibility = !!(value && value.trim().length > 0);
    });
  }

  toggleNewPassword() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleRepeatPassword() {
    this.hideRepeatPassword = !this.hideRepeatPassword;
  }
  
  async enviarEmail() {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.isEmailSucess = true;
    this.isLoading = false;

    const email = this.formEmail.get('email')?.value?.trim();

    if(!email) {
      this.snackbarService.showError("Informe um email")
      return;
    }

    const corpoEnviarEmail: EnviarEmailRequest = {
      email
    }
    this.usuarioService.enviarEmailRedefinirSenha(corpoEnviarEmail).subscribe({
      next: (_) => {
        this.isEmailSucess = true;
      }, 
      error: (_) => {
        this.snackbarService.showError("Erro enviar email")
      }
    })


    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.isEmailSucess = false;
  }

  voltarParaPaginaAnterior(): void {
    this.location.back();
  }

  async alterarSenha() {
    const novaSenha = this.formRedefinirSenha.get('novaSenha')?.value?.trim();
    const novaSenhaRepetida = this.formRedefinirSenha.get('novaSenhaRepetida')?.value?.trim();

    if(!novaSenha || !novaSenhaRepetida || !this.token) { return }

    const corpoEsqueciSenha: AlterarSenhaEsquecidaRequest = {
      repetirSenha: novaSenhaRepetida,
      senha: novaSenha,
      token: this.token
    }

    this.usuarioService.alterarSenhaEsquecida(corpoEsqueciSenha).subscribe({
      next: (resposta) => {
        this.snackbarService.showSuccess('Senha alterada com sucesso!');
        this.router.navigate(['/login']);
        console.log(resposta)
      },
      error: (_) => {
        this.snackbarService.showError("Erro ao alterar senha")
      }
    })
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
