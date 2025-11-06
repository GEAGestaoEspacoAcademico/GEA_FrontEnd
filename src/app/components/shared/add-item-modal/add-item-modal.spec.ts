import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemModal } from './add-item-modal';

describe('AddItemModal', () => {
  let component: AddItemModal;
  let fixture: ComponentFixture<AddItemModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddItemModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
