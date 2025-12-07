import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AgendarAula } from './agendar-aula';

describe('AgendarAula', () => {
  let component: AgendarAula;
  let fixture: ComponentFixture<AgendarAula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendarAula],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendarAula);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
