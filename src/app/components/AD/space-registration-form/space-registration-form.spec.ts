import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SpaceRegistrationForm } from './space-registration-form';

describe('SpaceRegistrationForm', () => {
  let component: SpaceRegistrationForm;
  let fixture: ComponentFixture<SpaceRegistrationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceRegistrationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceRegistrationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
