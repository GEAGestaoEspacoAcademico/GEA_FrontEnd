import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { Homecoord } from './homecoord';

describe('Homecoord', () => {
  let component: Homecoord;
  let fixture: ComponentFixture<Homecoord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Homecoord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homecoord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
