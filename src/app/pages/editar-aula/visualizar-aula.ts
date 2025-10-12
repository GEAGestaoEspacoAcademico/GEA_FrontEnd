import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap, tap, type Observable } from 'rxjs';
import type { Class } from '../../models/class.model';
import { selectAgendamentoLoading, selectAulaById } from '../../store/agendamento/agendamento.selectors';
import { Store } from '@ngrx/store';
import { AgendamentoActions } from '../../store/agendamento/agendamento.actions';

@Component({
  selector: 'app-editar-aula',
  standalone: false,
  templateUrl: './editar-aula.html',
  styleUrl: './editar-aula.css'
})
export class EditarAula implements OnInit{
  private route = inject(ActivatedRoute)
  private store = inject(Store)

  aula$!: Observable<Class | undefined>;
  loading$: Observable<boolean> = this.store.select(selectAgendamentoLoading);

  
  aulaId: string | null = null;
  
  ngOnInit(): void {
    this.aula$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      filter(id => !!id),
      switchMap(id => 
        this.store.select(selectAulaById(id)).pipe(
          tap(aula => {
            if (!aula) {
              this.store.dispatch(AgendamentoActions.loadAulaById({ id }));
              console.log(`Aula com id ${id} não encontrada no store. Buscando...`)
            }else{
              console.log(`Aula com id ${id} encontrada no store!`, aula);
            }
          })
        )
      )
    );
  }


}
