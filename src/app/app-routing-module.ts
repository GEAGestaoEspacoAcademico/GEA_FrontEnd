import { EsqueciSenha } from './pages/esqueci-senha/esqueci-senha';
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
import { SpaceManagement } from './pages/space-management/space-management';
import { Secretariahome } from './pages/secretaria/secretariahome/secretariahome';
import { RedefinirSenha } from './pages/redefinir-senha/redefinir-senha';
import { ListaEspacos } from './pages/secretaria/lista-espacos/lista-espacos';
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
      { path: 'redefinir-senha', component: RedefinirSenha },
    ],
  },
  {
    path: 'ad',
    component: MainLayout,
    canActivate: [RoleGuard],
    data: { roles: ['AUXILIAR_DOCENTE'] },
    children: [
      { path: 'home', component: Home },
      // { path: 'agendar-aula', component: ScheduleClass },
      // { path: 'agendar-evento', component: ScheduleEvent },
      { path: 'lista-espacos', component: SpaceManagement },
      // { path: 'cadastrar-espaco', component:  },
      // { path: 'cadastrar-espaco/:id', component: AdSpaceRegistrationPage },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'secretaria',
    component: MainLayout,
    canActivate: [RoleGuard],
    data: {roles: ['SECRETARIA']},
    children: [
      {path: 'home', component: Secretariahome},
      {path: 'visualizar-espacos', component: ListaEspacos}
    ]
  },
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'esqueci-senha', component: EsqueciSenha },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
