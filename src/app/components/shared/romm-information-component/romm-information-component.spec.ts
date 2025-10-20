import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RommInformationComponent } from './romm-information-component';

describe('RommInformationComponent', () => {
  let component: RommInformationComponent;
  let fixture: ComponentFixture<RommInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RommInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RommInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
