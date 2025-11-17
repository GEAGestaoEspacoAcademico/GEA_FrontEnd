import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

// Angular Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// NGRX Imports
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { agendamentoReducer } from './store/agendamento/agendamento.reducer';
import { AgendamentoEffects } from './store/agendamento/agendamento.effects';
import { AGENDAMENTO_FEATURE_KEY } from './store/agendamento/agendamento.selectors';

// App Specific Imports
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Layouts
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

// Pages
import { Aulas } from './pages/aulas/aulas';
import { Agenda } from './pages/agenda/agenda';
import { Configuracoes } from './pages/configuracoes/configuracoes';
import { Notificacoes } from './pages/notificacoes/notificacoes';
import { EditarAula } from './pages/editar-aula/visualizar-aula';
import { Login } from './pages/login/login';

// Shared Components
import { DaySelector } from './components/shared/day-selector/day-selector';
import { Header } from './components/shared/header/header';
import { TitleHighlight } from './components/shared/title-highlight/title-highlight';
import { ClassInfoCard } from './components/shared/class-info-card/class-info-card';
import { TabBar } from './components/shared/tab-bar/tab-bar';
import { ConfirmationModal } from './components/shared/confirmation-modal/confirmation-modal';
import { Scheduling } from './components/shared/scheduling/scheduling';
import { NotificationCard } from './components/shared/notification-card/notification-card';
import { RommInformationComponent } from './components/shared/romm-information-component/romm-information-component';
import { metaReducers } from './store/meta-reducer';
import { globalErrorInterceptor } from './Interceptors/Global/global-error-interceptor';
import { DashboardCard } from './components/shared/dashboard-card/dashboard-card';
import { AddItemModal } from './components/shared/add-item-modal/add-item-modal';
import { SpaceRegistrationForm } from './components/AD/space-registration-form/space-registration-form';
import { MultiDateSelector } from './components/shared/multi-date-selector/multi-date-selector';
import { SpaceManagement } from './pages/space-management/space-management';


// AD Components
import { SpaceManagementTable } from './components/AD/space-management-table/space-management-table';


@NgModule({
  declarations: [
    App,
    // Layouts
    MainLayout,
    AuthLayout,
    // Pages
    Aulas,
    Agenda,
    Configuracoes,
    Notificacoes,
    EditarAula,
    Login,
    SpaceManagement,
    // Shared Components
    ClassInfoCard,
    DaySelector,
    Header,
    TitleHighlight,
    TabBar,
    ConfirmationModal,
    Scheduling,
    NotificationCard,
    MainLayout,
    AuthLayout,
    RommInformationComponent,
    DashboardCard,
    AddItemModal,
    // AD Components
    SpaceManagementTable,
    MultiDateSelector,
    DashboardCard,
    SpaceManagementTable,
    SpaceRegistrationForm
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    // NGRX Setup Simplificado
    StoreModule.forRoot(
      {
        auth: authReducer,
        [AGENDAMENTO_FEATURE_KEY]: agendamentoReducer,
      },
      {
        metaReducers
      }
    ),
    EffectsModule.forRoot([AuthEffects, AgendamentoEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(), 
      autoPause: true,
      trace: false, 
      traceLimit: 75,
    }),

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    provideHttpClient(
      withInterceptors([globalErrorInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }
