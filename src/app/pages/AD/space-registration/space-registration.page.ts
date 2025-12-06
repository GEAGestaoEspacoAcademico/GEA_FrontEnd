import { SnackBarService } from './../../../services/snackbar/snackbar.service';
import type { CriarSalaFormulario } from './../../../types/util.types';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { SalaService } from '../../../services/sala/sala.service';
import { catchError, of, switchMap } from 'rxjs';
import type { AdicionarRecursoSalaRequest, CriarSalaRequest, RecursoAdiconarSala } from '../../../types/sala.type';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';

@Component({
  selector: 'app-space-registration',
  standalone: false,
  templateUrl: './space-registration.page.html',
  styleUrl: './space-registration.page.css',
})
export class SpaceRegistrationPage implements OnInit{
  
  private readonly salaService = inject(SalaService);
  private readonly snackBar = inject(SnackBarService);
  private readonly router = inject(Router);
  private readonly location = inject(Location)
  private readonly headerService = inject(HeaderTitleService);

  ngOnInit(): void {
    this.headerService.setTitle('Cadastro de Laboratório')
    this.headerService.showBack()
  }

  onFormSubimit(formularioCriarSala: CriarSalaFormulario) {
    const dadosPrincipais: CriarSalaRequest = {
      salaNome: formularioCriarSala.salaNome,
      salaCapacidade: Number(formularioCriarSala.salaCapacidade),
      pisoId: Number(formularioCriarSala.pisoId),
      disponibilidade: formularioCriarSala.disponibilidade ?? true,
      tipoSalaId: Number(formularioCriarSala.tipoSalaId),
      salaObservacoes: formularioCriarSala.salaObservacoes,
    };

    this.salaService
      .criarSala(dadosPrincipais)
      .pipe(
        switchMap((salaCriada) => {
          const equipamentos = formularioCriarSala.equipamentos;

          if (!equipamentos.length) {
            return of(true);
          }

          const recursosParaAPI = equipamentos.map((equipamento: RecursoAdiconarSala) => ({
            recursoId: equipamento.recursoId,
            quantidadeRecurso: equipamento.quantidadeRecurso,
          }));

          const requesicaoRecursos: AdicionarRecursoSalaRequest = {
            listaDeRecursosParaAdicionar: recursosParaAPI,
          };

          return this.salaService
            .adicionarRecursoEmSala(salaCriada.salaId, requesicaoRecursos)
            .pipe(
              catchError((_) => {
                this.snackBar.showError(`Erro ao adicinoar recurso a sala`);
                return of(null);
              }),
            );
        }),
      )
      .subscribe({
        next: () => {
          this.snackBar.showSuccess('Sala salva com sucesso!');
          this.router.navigate(['/secretaria/visualizar-espacos']);
        },
        error: () => {
          this.snackBar.showError('Erro ao salvar sala.');
        },
      });
    }
  cancelForm(){
    this.location.back()
  }
}
