import { Injectable } from '@angular/core';
import { ValidationType } from './dynamic-form-builder.model';
import { ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationFactoryService {
  private validationMap: Map<string, (arg?: string | number | RegExp) => ValidatorFn | undefined>;

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
      [ValidationType.Pattern, (arg) => this.createPatternValidation(arg)]
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
}
