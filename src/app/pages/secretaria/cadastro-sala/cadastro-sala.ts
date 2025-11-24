import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { SalaService } from '../../../services/sala/sala.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { catchError, of, switchMap } from 'rxjs';
import type { CriarSalaFormulario } from '../../../types/util.types';
import type { AdicionarRecursoSalaRequest } from '../../../types/sala.type';
import { Location } from '@angular/common';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-cadastro-sala',
  standalone: false,
  templateUrl: './cadastro-sala.html',
  styleUrl: './cadastro-sala.css',
})
export class CadastroSala implements OnInit{

  ngOnInit(): void {
    this.headerService.setTitle('Cadastro de Sala')
    this.headerService.showBack()
  }
  isSaving = false;

  private salaService = inject(SalaService);
  private snackbar = inject(SnackBarService);
  private router = inject(Router);
  private location = inject(Location);
  private headerService = inject(HeaderTitleService)

  onSave(formValue: CriarSalaFormulario) {
    this.isSaving = true;

    const dadosPrincipais = {
      salaNome: formValue.salaNome,
      salaCapacidade: formValue.salaCapacidade,
      pisoId: formValue.pisoId,
      disponibilidade: formValue.disponibilidade ?? true,
      tipoSalaId: formValue.tipoSalaId,
      salaObservacoes: formValue.salaObservacoes,
    };

    this.salaService
      .criarSala(dadosPrincipais)
      .pipe(
        switchMap((salaCriada) => {
          const equipamentos = formValue.equipamentos;

          if (!equipamentos.length) {
            return of(true);
          }

          const requesicaoRecursos: AdicionarRecursoSalaRequest = {
            listaDeRecursosParaAdicionar: equipamentos,
          };

          return this.salaService
            .adicionarRecursoEmSala(salaCriada.salaId, requesicaoRecursos)
            .pipe(
              catchError((_) => {
                this.snackbar.showError(`Erro ao adicinoar recurso a sala`);
                return of(null);
              }),
            );
        }),
      )
      .subscribe({
        next: () => {
          this.snackbar.showSuccess('Sala salva com sucesso!');
          this.router.navigate(['/secretaria/visualizar-espacos']);
        },
        error: (err) => {
          console.error('Erro no fluxo de salvamento completo:', err);
          this.snackbar.showError('Erro ao salvar sala.');
        },
        complete: () => {
          this.isSaving = false;
        },
      });
  }

  onCancel() {
    this.location.back();
  }
}
