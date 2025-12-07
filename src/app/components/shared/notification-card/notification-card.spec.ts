import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NotificationCard } from './notification-card';

describe('NotificationCard', () => {
  let component: NotificationCard;
  let fixture: ComponentFixture<NotificationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationCard],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
