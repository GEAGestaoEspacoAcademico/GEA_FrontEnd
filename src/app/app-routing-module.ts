import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Aulas } from './pages/aulas/aulas';
import { Agenda } from './pages/agenda/agenda';
import { Configuracoes } from './pages/configuracoes/configuracoes';
import { Notificacoes } from './pages/notificacoes/notificacoes';
import { EditarAula } from './pages/editar-aula/visualizar-aula';
import { Login } from './pages/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { RoleGuard } from './guards/role.guard';
import { Home } from './pages/AD/home/home';
import { FuncionarioForm } from './pages/secretaria/funcionario-form/funcionario-form';
/*
import {SpaceRegistration} from './pages/AD/spaceregistration/spaceregistration'
import {ScheduleClass} from './pages/AD/scheduleClass/scheduleClass'
import {ScheduleEvent} from './pages/AD/scheduleEvent/scheduleEvent'
*/
const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [RoleGuard],
    data: { roles: ['PROFESSOR'] },
    children: [
      { path: 'agenda', component: Agenda },
      { path: 'aulas', component: Aulas },
      { path: 'configuracoes', component: Configuracoes },
      { path: 'aulas/alterar/:id', component: EditarAula },
      { path: 'adhome', component: Home },
      { path: 'notificacoes', component: Notificacoes },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'funcform', component: FuncionarioForm },
    ],
  },
  {
    path: 'ad',
    component: MainLayout,
    canActivate: [RoleGuard],
    data: { roles: ['AUXILIAR_DOCENTE'] },
    children: [
      { path: 'home', component: Home },
      /*{ path: 'agendar-aula', component: ScheduleClass },
      { path: 'agendar-evento', component: ScheduleEvent },
      { path: 'lista-espacos', component: AdSpaceListPage },
      { path: 'cadastrar-espaco', component: SpaceRegistration },
      { path: 'cadastrar-espaco/:id', component: AdSpaceRegistrationPage },*/
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: AuthLayout,
    children: [{ path: 'login', component: Login }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
