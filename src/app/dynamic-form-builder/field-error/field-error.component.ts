import { Component, input, computed } from '@angular/core';
import { Validation } from '../dynamic-form-builder.model';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  imports: [],
  templateUrl: './field-error.component.html',
  styleUrl: './field-error.component.scss'
})
export class FieldErrorComponent {
  public validations = input.required<Validation[]>();
  public errors = input.required<ValidationErrors | null>();
  public visible = input.required<boolean | undefined>();
  public errorMessage = computed(() => {
    if(!this.errors() || !this.validations() || this.validations().length == 0) {
      return '';
    }
    const currentErrorKey = Object.keys(this.errors()!)[0];
    return this.validations().find((rule) => String(rule.type).toLowerCase() === currentErrorKey.toLowerCase())?.message;
  });

  constructor() {}
}
