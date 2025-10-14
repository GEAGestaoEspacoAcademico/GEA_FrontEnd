import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Aulas } from './pages/aulas/aulas';
import { Agenda } from './pages/agenda/agenda';
import { Configuracoes } from './pages/configuracoes/configuracoes';
import { Notificacoes } from './pages/notificacoes/notificacoes';
import { EditarAula } from './pages/editar-aula/visualizar-aula';
import { Login } from './pages/login/login';

const routes: Routes = [
  {path: 'login', component: Login},
  {path: 'agenda', component: Agenda},
  {path: 'aulas', component: Aulas},
  {path: 'aulas/alterar/:id', component: EditarAula},
  {path: 'configuracoes', component: Configuracoes},
  {path: 'notificacoes', component: Notificacoes},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
