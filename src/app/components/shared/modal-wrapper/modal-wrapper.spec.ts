import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ModalWrapper } from './modal-wrapper';

describe('ModalWrapper', () => {
  let component: ModalWrapper;
  let fixture: ComponentFixture<ModalWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalWrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
