import { Component, inject } from '@angular/core';
import { SalaService } from '../../../services/sala/sala.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { catchError, of, switchMap } from 'rxjs';
import type { CriarSalaFormulario } from '../../../types/util.types';
import type { AdicionarRecursoSalaRequest } from '../../../types/sala.type';

@Component({
  selector: 'app-cadastro-sala',
  standalone: false,
  templateUrl: './cadastro-sala.html',
  styleUrl: './cadastro-sala.css',
})
export class CadastroSala {
  isSaving = false;

  private salaService = inject(SalaService);
  private snackbar = inject(SnackBarService);
  private router = inject(Router);

  onSave(formValue: CriarSalaFormulario) {
    this.isSaving = true;

    const dadosPrincipais = {
      salaNome: formValue.salaNome,
      salaCapacidade: formValue.salaCapacidade,
      piso: formValue.piso,
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
            listaDeRecursosParaAdicionar: equipamentos
          }

          return this.salaService.adicionarRecursoEmSala(salaCriada.salaId, requesicaoRecursos).pipe(
            catchError((_) => {
              this.snackbar.showError(`Erro ao adicinoar recurso a sala`);
              return of(null)
            })
          )
        }),
      )
      .subscribe({
        next: () => {
          this.snackbar.showSuccess('Sala salva e recursos adicionados com sucesso!');
          this.router.navigate(['/secretaria/visualizar-espacos']);
        },
        error: (err) => {
          console.error('Erro no fluxo de salvamento completo:', err);
          this.snackbar.showError(
            'Erro ao salvar sala ou adicionar recursos. Verifique o console.',
          );
        },
        complete: () => {
          this.isSaving = false;
        },
      });
  }

  onCancel() {
    this.router.navigate(['/secretaria']);
  }
}
