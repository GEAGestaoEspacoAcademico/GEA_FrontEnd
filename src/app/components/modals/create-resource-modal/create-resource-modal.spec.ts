import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CreateResourceModal } from './create-resource-modal';

describe('CreateResourceModal', () => {
  let component: CreateResourceModal;
  let fixture: ComponentFixture<CreateResourceModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateResourceModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateResourceModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
