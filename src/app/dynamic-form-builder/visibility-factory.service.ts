import { Injectable } from '@angular/core';
import { FormField } from './dynamic-form-builder.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VisibilityFactoryService {
  private fieldsMap: Map<string, (name?: string, value?: any) => boolean> = new Map<string, (name?: string, value?: any) => boolean>([]);

  constructor() { }

  public initFieldsMap(fields: FormField[], parentForm: FormGroup) {
    fields.forEach((field) => {
      if(!field?.visibleIf) {
        this.fieldsMap.set(
          field.name, () => true
        );
      } else {
        this.fieldsMap.set(
          field.name, () => this.checkFieldVisibility(field.visibleIf!.field, field.visibleIf!.value, parentForm)
        );
      }
    });
  }

  public checkFieldVisibility(field: string, value: any, parentForm: FormGroup) {
    const formValue = parentForm.getRawValue();
    if(Object.keys(formValue).includes(field)) {
      return formValue[field] === value;
    }
    return true;
  }

  public getFieldVisibility(key: string, field?: string, value?: any): boolean {
    const creator = this.fieldsMap.get(key);
    if (!creator) {
      throw new Error(`Visibility for ${key} not found`);
    }
    return creator(field, value);
  }
}
