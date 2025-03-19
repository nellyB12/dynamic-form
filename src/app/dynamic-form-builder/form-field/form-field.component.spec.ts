import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormField, Layout, FieldType, ValidationType } from '../dynamic-form-builder.model';

const firstNameFormField = {
  name: "firstName",
  type: "text" as FieldType,
  label: "First name",
  width: 50,
  placeholder: "John",
  required: true,
  validations: [
    { type: "required" as ValidationType, message: "First name is required" }
  ]
}

// Test host component to provide required inputs
@Component({
  template: `
    <app-form-field
      [field]="field"
      [form]="form"
      [layout]="layout"
    ></app-form-field>
  `,
  imports: [FormFieldComponent]
})
class TestHostComponent {
  field: FormField = firstNameFormField;
  form: FormGroup = new FormGroup({ 
    firstName: new FormControl('', [Validators.required])
  });
  layout: Layout | null = null;
}

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, FormFieldComponent]
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
