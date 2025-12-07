import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { SpaceManagement } from './space-management';

describe('SpaceManagement', () => {
  let component: SpaceManagement;
  let fixture: ComponentFixture<SpaceManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
