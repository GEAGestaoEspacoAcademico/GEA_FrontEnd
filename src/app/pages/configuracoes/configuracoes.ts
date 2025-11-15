import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Teacher } from '../../models/teacher.model';
import { AuthActions } from '../../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import type { User } from '../../models/user.model';
import { filter, map, switchMap, type Observable } from 'rxjs';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';
import { SnackBarService } from '../../services/snackbar/snackbar.service';
import { ProfessorService } from '../../services/professor/professor.service';
import type { Disciplina } from '../../models/disciplina.model';
import type { ScheduleDayModal } from '../../components/shared/schedule-day-modal/schedule-day-modal';

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

  user$: Observable<User | null> = this.store.select(selectCurrentUser);
  disciplinas$!: Observable<Disciplina[]>;

  ngOnInit(): void {
    this.disciplinas$ = this.user$.pipe(
      filter((professor) => professor !== null),
      map((professor) => professor.usuarioId),
      switchMap((professorId) => {
        return this.professorService.getDisciplinasDoProfessor(professorId);
      }),
    );
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

  @ViewChild('ScheduleDayModal')
  ScheduleDayModal!: ScheduleDayModal;

  abrirModal() {
    this.ScheduleDayModal.abrirModal();
  }
}
