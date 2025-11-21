import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { SalaService } from '../../../services/salas/sala.service';
import { ActivatedRoute, Router } from '@angular/router';

import type { Sala } from '../../../models/sala.model';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import type { CriarSala } from '../../../types/criarsala';

@Component({
  selector: 'app-space-registration',
  standalone: false,
  templateUrl: './space-registration.page.html',
  styleUrl: './space-registration.page.css'
})
export class SpaceRegistrationPage implements OnInit {

  
  private route = inject(ActivatedRoute);
  private salaService = inject(SalaService);
  private snackBar = inject(SnackBarService);
  private router = inject(Router);

  isEditMode = false;
  spaceId: number | null = null;

  initialData: CriarSala | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        this.spaceId = Number(idParam);
        this.isEditMode = true;

        this.salaService.getSalaId(this.spaceId).subscribe({
          next: (data: Sala) => {
            this.initialData = {
              ...data,
              equipamentoId: [],
              softwaresId: [],
              equipamentos: [],
              softwares: []
            };
          },
          error: err => {
            this.snackBar.showError('Erro ao carregar os dados do espaço.');
            console.error(err);
          }
        });

      } else {
        this.isEditMode = false;
      }
    });
  }

  onFormSubmit(payload: CriarSala) {
    if (this.isEditMode && this.spaceId) {
      this.updateSala(this.spaceId, payload);
    } else {
      this.createSala(payload);
    }
  }

  private createSala(payload: CriarSala) {
    this.salaService.createSala(payload).subscribe({
      next: () => {
        this.snackBar.showSuccess('Espaço criado com sucesso!');
        this.router.navigate(['/ad/cadastrar-espaco']);
      },
      error: err => {
        this.snackBar.showError('Erro ao criar espaço.');
        console.error(err);
      }
    });
  }

  private updateSala(id: number, payload: CriarSala) {
    this.salaService.updateSala(id, payload).subscribe({
      next: () => {
        this.snackBar.showSuccess('Espaço atualizado com sucesso!');
        this.router.navigate(['/ad/cadastrar-espaco']);
      },
      error: err => {
        this.snackBar.showError('Erro ao atualizar espaço.');
        console.error(err);
      }
    });
  }


}
