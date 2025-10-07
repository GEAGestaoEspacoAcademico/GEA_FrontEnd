import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleHighligh } from './title-highligh';

describe('TitleHighligh', () => {
  let component: TitleHighligh;
  let fixture: ComponentFixture<TitleHighligh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleHighligh]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleHighligh);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
