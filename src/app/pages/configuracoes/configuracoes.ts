import type { OnInit } from '@angular/core';
import { Component, inject, ViewChild } from '@angular/core';
import type { Teacher } from '../../models/teacher.model';
import { AuthActions } from '../../store/auth/auth.actions';
import { Store } from '@ngrx/store';
import type { User } from '../../models/user.model';
import type { Observable } from 'rxjs';
import { selectAuthIsLoading, selectCurrentUser } from '../../store/auth/auth.selectors';
import type { ConfirmationModal } from '../../components/shared/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-configuracoes',
  standalone: false,
  templateUrl: './configuracoes.html',
  styleUrl: './configuracoes.css',
})
export class Configuracoes{
  private store = inject(Store);
  user$: Observable<User | null> =this.store.select(selectCurrentUser);

  @ViewChild('ConfirmationModal')
  confirmModal!: ConfirmationModal;

  openModal() {
    this.confirmModal.open();
  }

  closeModal() {
    this.confirmModal.onModalClose();
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  mockTeacher: Teacher = {
    nome: 'Prof. Dr. Lorem Ipsum',
    disciplinas: ['Cálculo 1', 'Cálculo 2', 'Álgebra Linear'],
    cursos: [
      {
        semestre: '1º semestre',
        curso: 'Engenharia Mecatrônica',
        disciplina: 'Cálculo 1',
      },
      {
        semestre: '2º semestre',
        curso: 'Análise e Desenvolvimento de Sistemas (ADS)',
        disciplina: 'Cálculo 1',
      },
      {
        semestre: '2º semestre',
        curso: 'Engenharia de Software',
        disciplina: 'Álgebra Linear',
      },
      {
        semestre: '3º semestre',
        curso: 'Engenharia Mecatrônica',
        disciplina: 'Cálculo 2',
      },
    ],
  };
}
