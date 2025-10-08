import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DaySelector } from './components/shared/day-selector/day-selector';
import { Header } from './components/shared/header/header';
import { TitleHighligh } from './components/shared/title-highligh/title-highligh';
import { provideHttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [
    App,
    DaySelector,
    Header,
    TitleHighligh
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatIconModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
