import { CommonModule } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { OptionItem } from '../dynamic-form-builder.model';

@Component({
  selector: 'app-checkbox-input',
  imports: [FormsModule, CommonModule, CheckboxModule],
  templateUrl: './checkbox-input.component.html',
  styleUrl: './checkbox-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxInputComponent),
    multi: true
  }]
})
export class CheckboxInputComponent implements ControlValueAccessor {
  public name = input.required<string>();
  public options = input.required<OptionItem[]>();
  public selectedOptions: OptionItem[] = [];
  public onChange?: (value: any) => void;
  public onTouched?: () => void;

  constructor() {}

  public writeValue(value: string[] | boolean) {
    if(typeof value === "boolean") {
      this.selectedOptions = [];
    } else {
      const newOptions: OptionItem[] = [];
      this.options().forEach((option) => {
        if(value.includes(option.value)) {
          newOptions.push(option);
        }
      })
      this.selectedOptions = newOptions;
    }
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onSelectedOptionsChange(event: OptionItem[]) {
    this.selectedOptions = event;
    if(this.onChange) {
      const newValue = this.selectedOptions.map((option) => option.value);
      this.onChange(newValue);
    }
    if(this.onTouched) {
      this.onTouched();
    }
  }
}
