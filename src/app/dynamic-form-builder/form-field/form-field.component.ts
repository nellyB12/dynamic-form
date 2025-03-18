import { Component, input, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FieldType, FormField, Layout } from '../dynamic-form-builder.model';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorComponent } from '../field-error/field-error.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { RadioInputComponent } from '../radio-input/radio-input.component';
import { CheckboxInputComponent } from "../checkbox-input/checkbox-input.component";
import { CheckboxBinaryInputComponent } from "../checkbox-binary-input/checkbox-binary-input.component";
import { SelectComponent } from '../select/select.component';
import { LayoutFactoryService } from '../layout-factory.service';
import { ValidationFactoryService } from '../validation-factory.service';
import { DynamicFormBuilderService } from '../dynamic-form-builder.service';

@Component({
  selector: 'app-form-field',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FieldErrorComponent, TextInputComponent, TextareaComponent, RadioInputComponent, CheckboxInputComponent, CheckboxBinaryInputComponent, SelectComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent implements OnInit, OnDestroy {
  public field = input.required<FormField>();
  public form = input.required<FormGroup>();
  public layout = input<Layout | null>();
  public rowClassName = computed(() => {
    if(!this.layout()?.gutters) {
      return 'gx-3 gy-4';
    }
    const horizontalGutter = this.layout()?.gutters?.horizontal;
    const verticalGutter = this.layout()?.gutters?.vertical;
    if(horizontalGutter == 0 && verticalGutter == 0) {
      return 'g-0';
    }
    if(horizontalGutter === verticalGutter) {
      return `g-${horizontalGutter}`;
    }
    return `gx-${horizontalGutter} gy-${verticalGutter}`;
  });
  public nestedForm = computed(() => this.form().get(this.field().name)! as FormGroup);
  public labelVisible = computed(() => {
    const exludedTypes = [FieldType.Checkbox, FieldType.Radio];
    if(!exludedTypes.includes(this.field().type)) {
      return true;
    }
    return false;
  });
  public readonly fieldType = FieldType;
  public readonly defaultDropdownPlaceholder = 'Please select';
  private subscription: Subscription = new Subscription();

  constructor(
    private layoutFactoryService: LayoutFactoryService,
    private validationFactoryService: ValidationFactoryService,
    private dynamicFormBuilderService: DynamicFormBuilderService
  ) {}

  ngOnInit() {
    const targetFieldNames = this.validationFactoryService.getSourceFieldTarget(this.field().name);
    if(targetFieldNames) {
      for(let targetFieldName of targetFieldNames) {
        this.subscription.add(
          this.form().get(this.field().name)?.valueChanges.subscribe((newValue) => {
            setTimeout(() => {
              // need to calculate validators of targetFieldName after change the layout and fields visibility
              const newTargetValidators = this.dynamicFormBuilderService.calcValidatorsForTargetFieldOnValueChange(
                targetFieldName,
                this.form().getRawValue()
              );
              if(newTargetValidators) {
                const targetControl = this.getTargetControl(this.form(), targetFieldName);
                targetControl?.clearValidators();
                targetControl?.markAsUntouched();
                targetControl?.addValidators(newTargetValidators);
                targetControl?.updateValueAndValidity();
              }
            }, 500);
          })
        );
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getTargetControl(form: FormGroup, targetFieldName: string) {
    const control = form.get(targetFieldName);
    if(control) {
      return control;
    }
    let found = null;
    let current: AbstractControl | null;
    Object.keys(form.controls).forEach((key) => {
      if(!current && form.get(key) instanceof FormGroup) {
        const childForm = form.get(key)! as FormGroup;
        current = this.getTargetControl(childForm, targetFieldName);
        if(current) {
          found = current;
        }
      }
    });
    return found;
  }

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

  public getFieldClassName(field: FormField) {
    return this.layoutFactoryService.getColumnClassName(field.width, this.layout()?.breakpoint);
  }
}
