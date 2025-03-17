import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionItem } from '../dynamic-form-builder.model';
import { Select } from 'primeng/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [FormsModule, CommonModule, Select],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }],
})
export class SelectComponent implements ControlValueAccessor {
  public name = input.required<string>();
  public id = input.required<string>();
  public options = input.required<OptionItem[]>();
  public placeholder = input<string>();
  public isInvalid = input<boolean>();
  public disabled: boolean = false;
  public selectedOption?: OptionItem | null;
  public onChange?: (value: string) => void;
  public onTouched?: () => void;

  constructor() {}

  public writeValue(value: string) {
    this.selectedOption = this.options().find((option) => option.value === value);
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onSelectedOptionChange(event: OptionItem | null) {
    this.selectedOption = event;
    if(this.onChange) {
      this.onChange(event?.value || null);
    }
    if(this.onTouched) {
      this.onTouched();
    }
  }

  public onBlur() {
    if(this.onTouched) {
      this.onTouched();
    }
  }
}
