import type { AlterarSenhaUsuarioRequest } from '../../../types/auth.type';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Component, inject } from '@angular/core';
import type { OnInit } from '@angular/core';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../../store/auth/auth.selectors';
import { switchMap, take, type Observable } from 'rxjs';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-redefinir-senha',
  standalone: false,
  templateUrl: './redefinir-senha.html',
  styleUrl: './redefinir-senha.css',
})
export class RedefinirSenha implements OnInit {
  private readonly snackbarService = inject(SnackBarService);
  private readonly router = inject(Router);
  private readonly UsuarioService = inject(UsuarioService);
  private readonly store = inject(Store);
  private readonly headerTitle = inject(HeaderTitleService);
  private readonly userId$: Observable<number | undefined> = this.store.select(selectUserId);

  hideOldPassword = false;
  hideNewPassword = false;
  hideRepeatPassword = false;

  btnOldVisibility = false;
  btnNewVisibility = false;
  btnRepeatVisibility = false;

  toggleOldPassword() {
    this.hideOldPassword = !this.hideOldPassword;
  }

  toggleNewPassword() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleRepeatPassword() {
    this.hideRepeatPassword = !this.hideRepeatPassword;
  }

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
      senhaAntiga: new FormControl('', [Validators.required]),
      novaSenha: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.senhaSegura(),
      ]),
      novaSenhaRepetida: new FormControl('', [Validators.required]),
    },
    {
      validators: this.senhasIguais,
    },
  );

  private senhaSegura(): ValidatorFn {
    return (input: AbstractControl): ValidationErrors | null => {
      const value = input.value;

      if (!value) {
        return null;
      }

      const temLetraMaiscula = /[A-Z]+/.test(value);
      const temLetraMinuscula = /[a-z]+/.test(value);
      const temNumero = /\d+/.test(value);
      const temCaracterEspecial = /[^a-zA-Z0-9]/.test(value);

      const senhaValida = temLetraMaiscula && temLetraMinuscula && temNumero && temCaracterEspecial;

      if (!senhaValida) {
        return {
          senha: {
            temLetraMaiscula: temLetraMaiscula,
            temLetraMinuscula: temLetraMinuscula,
            temNumero: temNumero,
            temCaracterEspecial: temCaracterEspecial,
          },
        };
      }
      return null;
    };
  }

  get errosDeSenhaSegura() {
    return this.formRedefinirSenha.get('novaSenha')?.errors?.['senha'];
  }

  ngOnInit(): void {
    this.formRedefinirSenha.reset();
    this.formRedefinirSenha.get('senhaAntiga')?.valueChanges.subscribe((value) => {
      this.btnOldVisibility = !!(value && value.trim().length > 0);
    });

    this.headerTitle.setTitle('');
    this.headerTitle.showBack();

    this.formRedefinirSenha.get('novaSenha')?.valueChanges.subscribe((value) => {
      this.btnNewVisibility = !!(value && value.trim().length > 0);
    });

    this.formRedefinirSenha.get('novaSenhaRepetida')?.valueChanges.subscribe((value) => {
      this.btnRepeatVisibility = !!(value && value.trim().length > 0);
    });
  }

  async alterarSenha() {
    const senhaAntiga = this.formRedefinirSenha.get('senhaAntiga')?.value?.trim();
    const novaSenha = this.formRedefinirSenha.get('novaSenha')?.value?.trim();
    const novaSenhaRepetida = this.formRedefinirSenha.get('novaSenhaRepetida')?.value?.trim();

    if (senhaAntiga && novaSenha && novaSenhaRepetida) {
      const requisicao: AlterarSenhaUsuarioRequest = {
        novaSenha: novaSenha,
        repetirNovaSenha: novaSenhaRepetida,
        senhaAtual: senhaAntiga,
      };

      this.userId$
        .pipe(
          take(1),
          switchMap((userId) => {
            if (userId === undefined) {
              throw new Error('ID de usuário não encontrado no Store.');
            }

            return this.UsuarioService.alterarSenha(userId, requisicao);
          }),
        )
        .subscribe({
          next: () => {
            this.snackbarService.showSuccess('Senha alterada com sucesso!');

            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
          },
          error: (err) => {
            console.error('Erro ao alterar senha:', err);
            this.snackbarService.showError('Falha ao alterar senha. Verifique os dados.');
          },
        });
    }
  }

  validarSenhas() {
    if (this.formRedefinirSenha.valid) {
      this.alterarSenha();
    }
  }
}
