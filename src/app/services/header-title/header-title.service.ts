import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderTitleService {
  private titleSubject = new BehaviorSubject<string>('Painel');
  public title$: Observable<string> = this.titleSubject.asObservable();
  public showBackButton = new BehaviorSubject<boolean>(false);
  public showBackButton$: Observable<boolean> = this.showBackButton.asObservable();

  showBack(): void {
    this.showBackButton.next(true);
  }

  hideBack(): void {
    this.showBackButton.next(false);
  }

  setTitle(title: string): void {
    this.titleSubject.next(title);
  }
}
