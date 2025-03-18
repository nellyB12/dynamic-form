import { Injectable } from '@angular/core';
import { State, FieldType, Validation, FormField } from './dynamic-form-builder.model';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import { ValidationFactoryService } from './validation-factory.service';
import { BehaviorSubject } from 'rxjs';
import { VisibilityFactoryService } from './visibility-factory.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormBuilderService {
  private _currentState: BehaviorSubject<State | null> = new BehaviorSubject<State | null>(null);
  private _formValue: BehaviorSubject<any> = new BehaviorSubject(null);
  public currentState$ = this._currentState.asObservable();
  public formValue$ = this._formValue.asObservable();
  
  constructor(
    private validationFactoryService: ValidationFactoryService,
    private visibilityFactoryService: VisibilityFactoryService
  ) {}

  public set currentState(value: State | null) {
    this._currentState.next(value);
  }

  public set formValue(value: any) {
    this._formValue.next(value);
  }

  public createNewForm(state: State): FormGroup {
    const group = new FormGroup({});
    const fieldValues = this.calcInitialFieldValues(state.fields);
    this.addControls(group, state.fields, fieldValues);
    return group;
  }

  public addControls(group: FormGroup, fields: FormField[], fieldValues: {[key: string]: any }): void {
    fields.forEach((field) => {
      if(field.type == FieldType.Group) {
        const nestedGroup = new FormGroup({});
        group.addControl(field.name, nestedGroup);
        this.addControls(nestedGroup, field.fields || [], fieldValues);
      } else {
        const validators = this.calcValidators(fieldValues, field.validations);
        const control = new FormControl(
          field.value || (field.type == FieldType.Checkbox ? this.getCheckboxValues(field) : ''),
          validators
        );
        group.addControl(field.name, control);
      }
    });
  }

  private calcInitialFieldValues(fields: FormField[]): {[key: string]: any } {
    const fieldValues: {[key: string]: any } = {};
    if(!fields || fields.length == 0) {
      return fieldValues;
    }
    fields.forEach((field) => {
      if(field.type == FieldType.Group) {
        fieldValues[field.name] = this.calcInitialFieldValues(field.fields);
      } else {
        fieldValues[field.name] = field?.value ?? null;
      }
    });
    return fieldValues;
  }

  private getCheckboxValues(field: FormField): string[] | boolean {
    if(field.options && field.options?.length > 0) {
      return field.options?.filter(option => option.checked).map(option => option.value) || [];
    }
    return field.value || false;
  }

  public prepareFormResultAsJSON(formValue: any): string {
    if(!formValue) {
      return '';
    }
    if(typeof formValue == "object") {
      let result = Object.assign({}, formValue);
      const fields = this._currentState.getValue()?.fields;
      this.removeEmptyValuesAndValuesOfHiddenFields(result, fields);
      return JSON.stringify(result, null, 2);
    }
    if(typeof formValue == "string") {
      return formValue;
    }
    return '';
  }

  private checkValidationRules(validation: Validation, fieldValues: {[key: string]: any }): boolean {
    if(Object.keys(fieldValues).includes(validation.when!.field)) {
      return fieldValues[validation.when!.field] === validation.when!.value;
    }
    
    let found = false;
    Object.keys(fieldValues).forEach((key) => {
      if(typeof fieldValues[key] === "object" && !!fieldValues[key]) {
        if (this.checkValidationRules(validation, fieldValues[key])) {
          found = true;
        };
      };
    });
    return found;
  }

  private calcValidators(fieldValues: {[key: string]: any }, validations?: Validation[]): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if(!validations) {
      return validators;
    }
    if(validations.length > 0) {
      validations.forEach((validation) => {
        let includeValidator: boolean;
        if(!validation.when) {
          includeValidator = true;
        } else {
          includeValidator = this.checkValidationRules(validation, fieldValues);
        }
        if(includeValidator) {
          const fieldValidatorFn = this.validationFactoryService.getValidatorFn(validation.type, validation?.value);
          if(fieldValidatorFn) {
            validators.push(fieldValidatorFn);
          }
        }
      });
    }
    return validators;
  }

  private getTargetFieldValidations(fields: FormField[], targetFieldName: string) {
    if(fields?.find((el) => el.name == targetFieldName)) {
      return fields?.find((el) => el.name == targetFieldName)?.validations;
    }
    let found: Validation[] = [];
    let current: Validation[] | undefined;
    fields.forEach((field) => {
      if((!current || current.length == 0) && field.type === FieldType.Group) {
        current = this.getTargetFieldValidations(field.fields, targetFieldName);
        if(current && current.length > 0) {
          found = current;
        }
      }
    });
    return found;
  }

  public calcValidatorsForTargetFieldOnValueChange(targetFieldName: string, formValue: any): ValidatorFn[] {
    const fields = this._currentState.getValue()?.fields || [];
    const validations = this.getTargetFieldValidations(fields, targetFieldName);
    return this.calcValidators(formValue, validations);
  }

  private removeEmptyValuesAndValuesOfHiddenFields(result: any, fields?: FormField[]): any {
    Object.keys(result).forEach((key: string) => {
      this.removeEmptyValues(key, result);
    });
    if(fields) {
      Object.keys(result).forEach((key: string) => {
        this.removeValuesOfHiddenFields(key, result, fields);
      }); 
    }
  }

  private removeEmptyValues(key: string, result: any) {
    if(!result[key]) {
      delete result[key];
      return;
    } else if(typeof result[key] == "object") {
      if(Array.isArray(result[key])) {
        if(result[key].length == 0) {
          delete result[key];
        }
        return;
      }
      Object.keys(result[key]).forEach((subKey: string) => {
        this.removeEmptyValues(subKey, result[key]);
      });
      if(!result[key]) {
        delete result[key];
        return;
      }
    }
  }

  private removeValuesOfHiddenFields(key: string, result: any, fields: FormField[]) {
    const currentField = fields.find((field) => field.name === key);
    if(currentField) {
      const isVisible = this.visibilityFactoryService.getFieldVisibility(key, currentField?.visibleIf?.field, currentField?.visibleIf?.value);
      if(!isVisible) {
        delete result[key];
      }
    }
  }
}
