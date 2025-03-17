import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType, FormField } from '../dynamic-form-builder.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorComponent } from '../field-error/field-error.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { RadioInputComponent } from '../radio-input/radio-input.component';
import { CheckboxInputComponent } from "../checkbox-input/checkbox-input.component";
import { CheckboxBinaryInputComponent } from "../checkbox-binary-input/checkbox-binary-input.component";
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-form-field',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FieldErrorComponent, TextInputComponent, TextareaComponent, RadioInputComponent, CheckboxInputComponent, CheckboxBinaryInputComponent, SelectComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  public field = input.required<FormField>();
  public form = input.required<FormGroup>();
  public isVisible = computed(() => this.field()?.visible ?? true);
  public nestedForm = computed(() => this.form().get(this.field().name)! as FormGroup);
  public labelVisible = computed(() => {
    const exludedTypes = [FieldType.Checkbox, FieldType.Radio];
    if(!exludedTypes.includes(this.field().type)) {
      return true;
    }
    return this.field().options!.length == 1;
  });
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
