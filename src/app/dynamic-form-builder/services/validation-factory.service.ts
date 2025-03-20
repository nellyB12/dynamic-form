import { Injectable } from '@angular/core';
import { ValidationType, FormField, FieldType } from '../dynamic-form-builder.model';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationFactoryService {
  private validationMap: Map<string, (arg?: string | number | RegExp) => ValidatorFn | undefined>;
  private sourceFieldsMap: Map<string, Set<string>> = new Map([]);

  constructor() {
    this.validationMap = new Map<string, (arg?: string | number | RegExp) => ValidatorFn | undefined>([
      [ValidationType.Email, () => Validators.email],
      [ValidationType.Required, () => Validators.required],
      [ValidationType.RequiredTrue, () => Validators.requiredTrue],
      [ValidationType.MinLength, (arg) => this.createMinLengthValidation(arg)],
      [ValidationType.MaxLength, (arg) => this.createMaxLengthValidation(arg)],
      [ValidationType.Min, (arg) => this.createMinValidation(arg)],
      [ValidationType.Max, (arg) => this.createMaxValidation(arg)],
      [ValidationType.Email, () => Validators.email],
      [ValidationType.Pattern, (arg) => this.createPatternValidation(arg)],
      [ValidationType.SsnCheck, () => this.createSsnCheckValidation()],
      [ValidationType.Passport, () => this.createPassportValidation()],
      [ValidationType.Vat, () => this.createVatValidation()]
    ]);
  }

  private createMinLengthValidation(val: string | number | RegExp | undefined): ValidatorFn | undefined {
    if(!val) {
      return;
    }
    if(typeof val == 'string') {
      return Validators.minLength(Number(val));
    }
    if(typeof val == 'number') {
      return Validators.minLength(val);
    }
    return;
  }

  private createMaxLengthValidation(val: string | number | RegExp | undefined): ValidatorFn | undefined {
    if(!val) {
      return;
    }
    if(typeof val == 'string') {
      return Validators.maxLength(Number(val));
    }
    if(typeof val == 'number') {
      return Validators.maxLength(val);
    }
    return;
  }

  private createMinValidation(val: string | number | RegExp | undefined): ValidatorFn | undefined {
    if(!val) {
      return;
    }
    if(typeof val == 'string') {
      return Validators.min(Number(val));
    }
    if(typeof val == 'number') {
      return Validators.min(val);
    }
    return;
  }

  private createMaxValidation(val: string | number | RegExp | undefined): ValidatorFn | undefined {
    if(!val) {
      return;
    }
    if(typeof val == 'string') {
      return Validators.max(Number(val));
    }
    if(typeof val == 'number') {
      return Validators.max(val);
    }
    return;
  }

  private createPatternValidation(val: string | number | RegExp | undefined): ValidatorFn | undefined {
    if(!val) {
      return;
    }
    if(typeof val === "string") {
      return Validators.pattern(val);
    }
    return;
  }

  private createSsnCheckValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (!control.value) {
            return null;
        }
        const testPattern = '^(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$';
        const controlIsValid = new RegExp(testPattern).test(control.value);
        return controlIsValid ? null : { ssnCheck: true };
    };
  }

  private createPassportValidation() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
          return null;
      }
      const testPattern = '^[a-zA-Z0-9]+$';
      const controlIsValid = new RegExp(testPattern).test(control.value);
      return controlIsValid ? null : { passport: true };
    };
  }

  private createVatValidation() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
          return null;
      }
      const testPattern = '^[a-zA-Z0-9]+$';
      const controlIsValid = new RegExp(testPattern).test(control.value);
      return controlIsValid ? null : { vat: true };
    };
  }

  public getValidatorFn(key: string, params?: any): ValidatorFn | undefined {
    const creator = this.validationMap.get(key);
    if (!creator) {
      throw new Error(`Validation type ${key} not found`);
    }

    const validation = creator(params);

    return validation instanceof Function
      ? validation
      : undefined;
  }

  public calcDynamicSourceFields(fields: FormField[]) {
    fields.forEach((field: FormField) => {
      if(field.type === FieldType.Group) {
        this.calcDynamicSourceFields(field.fields!);
      } else {
        if(field?.validations) {
          field.validations.forEach((validation) => {
            if(validation.when?.field) {
              const foundField = this.sourceFieldsMap?.get(validation.when?.field);
              if(!foundField) {
                this.sourceFieldsMap.set(validation.when?.field, new Set([field.name]));
              } else {
                this.sourceFieldsMap.get(validation.when?.field)?.add(field.name);
              }
            }
          });
        }
      }
    });
  }

  public getSourceFieldTarget(key: string): Set<string> | undefined {
    return this.sourceFieldsMap?.get(key);
  }
}
