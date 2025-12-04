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
import { ScheduleEvent } from './pages/AD/schedule-event/schedule-event';
import { AgendarAula } from './pages/professor/agendar-aula/agendar-aula';
import { SpaceManagement } from './pages/AD/space-management/space-management';
import { Secretariahome } from './pages/secretaria/secretariahome/secretariahome';
import { RedefinirSenha } from './pages/shared/redefinir-senha/redefinir-senha';
import { ListaEspacos } from './pages/secretaria/lista-espacos/lista-espacos';
import { CadastroSala } from './pages/secretaria/cadastro-sala/cadastro-sala';
import { SpaceRegistrationPage } from './pages/AD/space-registration/space-registration.page';
import { Funcionarios } from './pages/secretaria/funcionarios/funcionarios';
import { FuncionarioForm } from './pages/secretaria/funcionario-form/funcionario-form';
import { ScheduleClass } from './pages/AD/schedule-class/schedule-class';
import { AgendarSalaMateria } from './pages/secretaria/agendar-sala-materia/agendar-sala-materia';
import { VisualizarAula } from './pages/professor/visualizar-aula/visualizar-aula';
import { EspacosAcademicos } from './pages/shared/espacos-academicos/espacos-academicos';
import { Homecoord } from './pages/coordenacao/homecoord/homecoord';
import { Calendario } from './pages/coordenacao/calendario/calendario';
import { Agendamentos } from './pages/AD/agendamentos/agendamentos';
import { ListarCursos } from './pages/secretaria/listar-cursos/listar-cursos';
import { ListarDisciplinas } from './pages/secretaria/listar-disciplinas/listar-disciplinas';

const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [RoleGuard],
    data: { roles: ['PROFESSOR', 'COORDENADOR'] },
    children: [
      { path: 'agenda', component: AgendarAula },
      { path: 'aulas', component: VisualizarAula },
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
      { path: 'agendar-aula', component: ScheduleClass },
      { path: 'agendar-evento', component: ScheduleEvent },
      { path: 'lista-espacos', component: SpaceManagement },
      { path: 'cadastrar-espaco', component: SpaceRegistrationPage },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'cadastrar-espaco', component: SpaceRegistrationPage },
      {path: 'agendamentos', component: Agendamentos}
    ],
  },
  {
    path: 'secretaria',
    component: MainLayout,
    canActivate: [RoleGuard],
    data: { roles: ['SECRETARIA', 'AUXILIAR_DOCENTE'] },
    children: [
      { path: 'home', component: Secretariahome },
      { path: 'visualizar-espacos', component: ListaEspacos },
      { path: 'cadastrar-laboratorio', component: CadastroSala },
      { path: 'agendar-sala', component: AgendarSalaMateria },
      { path: 'funcionarios', component: Funcionarios },
      { path: 'cadastrar-funcionario', component: FuncionarioForm },
      { path: 'listar-cursos', component: ListarCursos},
      {path: 'listar-disciplinas', component: ListarDisciplinas}
    ],
  },
  {
    path: 'coordenacao',
    component: MainLayout,
    canActivate: [RoleGuard],
    data: {roles: ['COORDENADOR', 'AUXILIAR_DOCENTE']},
    children: [
      { path: 'visualizar-espaco', component: EspacosAcademicos},
      { path: 'homecoord', component: Homecoord},
      { path: 'calendario', component: Calendario},
      { path: '', redirectTo: 'homecoord', pathMatch: 'full' }
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
