import { Injectable } from '@angular/core';
import { State, FieldType, Validation, FormField } from './dynamic-form-builder.model';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { ValidationFactoryService } from './validation-factory.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormBuilderService {
  private _currentState: BehaviorSubject<State | null> = new BehaviorSubject<State | null>(null);
  private _formValue: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentState$ = this._currentState.asObservable();
  public formValue$ = this._formValue.asObservable();
  
  constructor(private validationFactoryService: ValidationFactoryService) {}

  public set currentState(value: State | null) {
    this._currentState.next(value);
  }

  public set formValue(value: any) {
    this._formValue.next(value);
  }

  public createNewForm(state: State): FormGroup {
    const group = new FormGroup({});
    this.addControls(group, state.fields);
    return group;
  }

  public addControls(group: FormGroup, fields: FormField[]): void {
    fields.forEach((field) => {
      if(field.type == FieldType.Group) {
        const nestedGroup = new FormGroup({});
        group.addControl(field.name, nestedGroup);
        this.addControls(nestedGroup, field.fields || []);
      } else {
        const validators = this.calcValidators(field.validations);
        const control = new FormControl(
          field.value || (field.type == FieldType.Checkbox ? this.getCheckboxValues(field) : ''),
          validators
        );
        group.addControl(field.name, control);
      }
    });
  }

  private getCheckboxValues(field: FormField): string[] {
    return field.options?.filter(option => option.checked).map(option => option.value) || [];
  }

  public prepareFormResultAsJSON(formValue: any): string {
    if(!formValue) {
      return '';
    }
    if(typeof formValue == "object") {
      const result = Object.assign({}, formValue);
      Object.keys(result).forEach((key: string) => {
        if(!result[key]) {
          delete result[key];
        } else if(typeof result[key] == "object") {
          if(Object.keys(result[key]).every((k) => !result[key][k])) {
            delete result[key];
          }
        }
      });
      return JSON.stringify(result);
    }
    if(typeof formValue == "string") {
      return formValue;
    }
    return '';
  }

  private calcValidators(validations?: Validation[]): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if(!validations) {
      return validators;
    }
    if(validations.length > 0) {
      validations.forEach((validation) => {
        const fieldValidatorFn = this.validationFactoryService.getValidatorFn(validation.type, validation?.value);
        if(fieldValidatorFn) {
          validators.push(fieldValidatorFn);
        }
      });
    }
    return validators;
  }
}
