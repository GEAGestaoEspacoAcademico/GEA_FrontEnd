import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secretariahome } from './secretariahome';

describe('Secretariahome', () => {
  let component: Secretariahome;
  let fixture: ComponentFixture<Secretariahome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Secretariahome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Secretariahome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
