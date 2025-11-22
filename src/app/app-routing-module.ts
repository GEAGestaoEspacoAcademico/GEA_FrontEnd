import { EsqueciSenha } from './pages/shared/esqueci-senha/esqueci-senha';
import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { Configuracoes } from './pages/AD/configuracoes/configuracoes';
import { Notificacoes } from './pages/shared/notificacoes/notificacoes';
import { EditarAula } from './pages/AD/editar-aula/visualizar-aula';
import { Login } from './pages/shared/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { RoleGuard } from './guards/role.guard';
import { Home } from './pages/AD/home/home';
import { AgendarAula } from './pages/professor/agendar-aula/agendar-aula';
import { SpaceManagement } from './pages/AD/space-management/space-management';
import { Secretariahome } from './pages/secretaria/secretariahome/secretariahome';
import { RedefinirSenha } from './pages/shared/redefinir-senha/redefinir-senha';
import { ListaEspacos } from './pages/secretaria/lista-espacos/lista-espacos';
import { CadastroSala } from './pages/secretaria/cadastro-sala/cadastro-sala';
import { Aulas } from './pages/AD/aulas/aulas';
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
      { path: 'agenda', component: AgendarAula },
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
      { path: 'lista-espacos', component: SpaceManagement },
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
    data: {roles: ['SECRETARIA', 'AUXILIAR_DOCENTE']},
    children: [
      {path: 'home', component: Secretariahome},
      {path: 'visualizar-espacos', component: ListaEspacos},
      {path: 'cadastrar-laboratorio', component: CadastroSala}
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
