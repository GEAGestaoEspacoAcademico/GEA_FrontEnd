import {  TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing'

import { DashboardCard } from './dashboard-card';

describe('DashboardCard', () => {
  let component: DashboardCard;
  let fixture: ComponentFixture<DashboardCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
