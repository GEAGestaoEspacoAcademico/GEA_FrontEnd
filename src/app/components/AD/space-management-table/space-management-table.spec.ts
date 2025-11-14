import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceManagementTable } from './space-management-table';

describe('SpaceManagementTable', () => {
  let component: SpaceManagementTable;
  let fixture: ComponentFixture<SpaceManagementTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceManagementTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceManagementTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
