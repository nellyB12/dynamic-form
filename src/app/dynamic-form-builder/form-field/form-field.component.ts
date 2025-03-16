import { Component, input, computed } from '@angular/core';
import { FieldType, FormField } from '../dynamic-form-builder.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorComponent } from '../field-error/field-error.component';

@Component({
  selector: 'app-form-field',
  imports: [FormsModule, ReactiveFormsModule, FieldErrorComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  public field = input.required<FormField>();
  public form = input.required<FormGroup>();
  public isVisible = computed(() => this.field()?.visible ?? true);
  public nestedForm = computed(() => this.form().get(this.field().name)! as FormGroup);
  public readonly fieldType = FieldType;
  public readonly defaultDropdownPlaceholder = 'Please select';

  constructor() {}

  public onCheckboxChange(event: Event, fieldName: string, optionValue: string) {
    const control = this.form().get(fieldName);
    const currentValue = control?.value as string[];
    const target = event.currentTarget as HTMLInputElement;
    if(target.checked) {
      currentValue.push(optionValue);
    } else {
      const optionIndex = currentValue.findIndex((el) => el === optionValue);
      if(optionIndex > -1) {
        currentValue.splice(optionIndex, 1);
      }
    }
    control?.setValue(currentValue);
  }
}
