import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserCargo } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private store = inject(Store);

  cargo$ = this.store.select(selectUserCargo);
}
