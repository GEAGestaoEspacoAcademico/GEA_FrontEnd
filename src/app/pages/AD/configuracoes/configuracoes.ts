import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import { AuthActions } from '../../../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import type { Usuario } from '../../../models/usuario.model';
import { filter, map, switchMap, take, type Observable } from 'rxjs';
import { selectCurrentUser, selectUserCargo } from '../../../store/auth/auth.selectors';
import type { ConfirmationModal } from '../../../components/modals/confirmation-modal/confirmation-modal';
import { SnackBarService } from '../../../services/snackbar/snackbar.service';
import type { Disciplina } from '../../../models/disciplina.model';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import ProfessorService from '../../../services/professor/professor.service';

@Component({
  selector: 'app-configuracoes',
  standalone: false,
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes implements OnInit {
  private store = inject(Store);
  private notificationService = inject(SnackBarService);
  private professorService = inject(ProfessorService);
  private headerService = inject(HeaderTitleService);

  user$: Observable<Usuario | null> = this.store.select(selectCurrentUser);
  disciplinas$!: Observable<Disciplina[]>;
  cargo$: Observable<string | undefined> = this.store.select(selectUserCargo);

  ngOnInit(): void {
    this.headerService.setTitle('Configurações');
    this.headerService.hideBack();
    this.disciplinas$ = this.user$.pipe(
      filter((professor) => professor !== null),
      map((professor) => professor.usuarioId),
      switchMap((professorId) => {
        return this.professorService.getDisciplinasDoProfessor(professorId);
      }),
    );
    this.cargo$.pipe(take(1)).subscribe((cargo) => {
      if (cargo === 'COORDENADOR') {
        this.headerService.setTitle('');
        this.headerService.showBack();
      } else {
        this.headerService.hideBack();
      }
    });
  }

  @ViewChild('ConfirmationModal')
  confirmModal!: ConfirmationModal;

  openModal() {
    this.confirmModal.open();
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.notificationService.showSuccess('Usuario deslogado com sucesso.');
  }
}
