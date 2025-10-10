import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { ClassInfoCard } from './class-info-card';

describe('ClassInfoCard', () => {
  let component: ClassInfoCard;
  let fixture: ComponentFixture<ClassInfoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassInfoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassInfoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
