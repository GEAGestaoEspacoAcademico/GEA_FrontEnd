import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Aulas } from './pages/aulas/aulas';
import { Agenda } from './pages/agenda/agenda';
import { Configuracoes } from './pages/configuracoes/configuracoes';
import { Notificacoes } from './pages/notificacoes/notificacoes';
import { EditarAula } from './pages/editar-aula/visualizar-aula';
import { Login } from './pages/login/login';
import { MainLayout } from '../layouts/main-layout/main-layout';
import { AuthLayout } from '../layouts/auth-layout/auth-layout';

const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'agenda', component: Agenda },
      { path: 'aulas', component: Aulas },
      { path: 'configuracoes', component: Configuracoes },
      { path: 'notificacoes', component: Notificacoes },
      { path: '', redirectTo: '/aulas', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
