import { Component, inject } from '@angular/core';
import { SalaService } from '../../../services/sala/sala.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import { catchError, forkJoin, of, switchMap } from 'rxjs';

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

  onSave(formValue: any) {
    this.isSaving = true;

    const dadosPrincipais = {
      salaNome: formValue.nome,
      salaCapacidade: formValue.capacidade,
      piso: formValue.piso,
      disponibilidade: formValue.disponibilidade ?? true,
      tipoSalaId: formValue.idTipoSala,
      salaObservacoes: formValue.observacoes,
    };

    this.salaService
      .criarSala(dadosPrincipais)
      .pipe(
        switchMap((salaCriada) => {
          const equipamentos = formValue.equipamentos || [];

          if (!equipamentos.length) {
            return of(true);
          }

          const recursosObservables = equipamentos.map((recurso: any) => {
            const requestBody = {
              idRecurso: recurso.idRecurso,
              quantidade: recurso.quantidade,
            };

            return this.salaService.adicionarRecursoEmSala(salaCriada.salaId, requestBody).pipe(
              catchError((err) => {
                console.error(
                  `Erro ao adicionar recurso ID ${recurso.idRecurso} para a sala ${salaCriada.salaId}.`,
                  err,
                );
                return of(null);
              }),
            );
          });

          return forkJoin(recursosObservables);
        }),
      )
      .subscribe({
        next: () => {
          this.snackbar.showSuccess('Sala salva e recursos adicionados com sucesso!');
          this.router.navigate(['/secretaria/espacos']);
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
