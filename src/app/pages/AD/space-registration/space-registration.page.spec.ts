import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SpaceRegistrationPage } from './space-registration.page';

describe('SpaceRegistrationPage', () => {
  let component: SpaceRegistrationPage;
  let fixture: ComponentFixture<SpaceRegistrationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceRegistrationPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
