import { Component, input, computed, signal, OnInit, OnDestroy, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, of } from 'rxjs';
import { FieldType, FormField, Layout, OptionItem, Width } from '../dynamic-form-builder.model';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldErrorComponent } from '../field-error/field-error.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { RadioInputComponent } from '../radio-input/radio-input.component';
import { CheckboxInputComponent } from "../checkbox-input/checkbox-input.component";
import { CheckboxBinaryInputComponent } from "../checkbox-binary-input/checkbox-binary-input.component";
import { SelectComponent } from '../select/select.component';
import { LayoutFactoryService } from '../services/layout-factory.service';
import { ValidationFactoryService } from '../services/validation-factory.service';
import { DynamicFormBuilderService } from '../services/dynamic-form-builder.service';
import { DataApiService } from '../data-api.service';

@Component({
  selector: 'app-form-field',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FieldErrorComponent, TextInputComponent, TextareaComponent, RadioInputComponent, CheckboxInputComponent, CheckboxBinaryInputComponent, SelectComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent implements OnInit, OnDestroy {
  public selectControl = viewChild<SelectComponent>(SelectComponent);
  public field = input.required<FormField>();
  public form = input.required<FormGroup>();
  public fieldApiOptions = signal<OptionItem[] | undefined>(undefined);
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
    private dynamicFormBuilderService: DynamicFormBuilderService,
    private dataApiService: DataApiService
  ) {}

  ngOnInit() {
    if(this.field().lookupApi) {
      this.subscription.add(
        this.dataApiService.apiLookupCall(this.field().lookupApi!).subscribe((response) => {
          if(response?.data) {
            const options = response.data.map((option: any) => {
              return {
                label: option.name,
                value: option.code
              }
            });
            this.fieldApiOptions.set(options);

            // manage field value of dropdown field type
            if(this.field().type === FieldType.Dropdown && this.field().value) {
              setTimeout(() => {
                this.selectControl()!.writeValue(this.field().value);
              }, 100);
            }
          }
        })
      );
    }

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

  public getOptions(): OptionItem[] {
    if(this.fieldApiOptions()) {
      return this.fieldApiOptions()!;
    }
    if(this.field().options) {
      return this.field().options!;
    }
    return [];
  }

  public getRadioOptions(): Observable<OptionItem[]> {
    if(this.fieldApiOptions()) {
      return of(this.fieldApiOptions()!);
    }
    if(this.field().options) {
      return of(this.field().options!);
    }
    return  of([]);
  }

  public getFieldClassName(field: FormField) {
    const fieldWidth = field?.width ?? Width.FullWidth;
    return this.layoutFactoryService.getColumnClassName(fieldWidth, this.layout()?.breakpoint);
  }
}
