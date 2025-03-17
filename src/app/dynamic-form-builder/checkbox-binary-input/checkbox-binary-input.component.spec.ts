import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxBinaryInputComponent } from './checkbox-binary-input.component';

describe('CheckboxBinaryInputComponent', () => {
  let component: CheckboxBinaryInputComponent;
  let fixture: ComponentFixture<CheckboxBinaryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxBinaryInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxBinaryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
