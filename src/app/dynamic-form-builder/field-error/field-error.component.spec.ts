import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldErrorComponent } from './field-error.component';
import { Validation } from '../dynamic-form-builder.model';
import { ValidationErrors } from '@angular/forms';
import { Component } from '@angular/core';

// Test host component to provide required inputs
@Component({
  template: `
    <app-field-error
      [validations]="validations"
      [errors]="errors"
      [visible]="visible"
    ></app-field-error>
  `,
  imports: [FieldErrorComponent]
})
class TestHostComponent {
  validations: Validation[] = [];
  errors: ValidationErrors | null = null;
  visible: boolean | undefined = false;
}

describe('FieldErrorComponent', () => {
  let component: FieldErrorComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, FieldErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
