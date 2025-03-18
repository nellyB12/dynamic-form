import { Component, forwardRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-text-input',
  imports: [FormsModule, CommonModule, InputTextModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextInputComponent),
    multi: true
  }],
})
export class TextInputComponent implements ControlValueAccessor {
  public name = input.required<string>();
  public id = input.required<string>();
  public placeholder = input<string>();
  public isInvalid = input<boolean>();
  public disabled: boolean = false;
  public value?: string;
  public onChange?: (value: string) => void;
  public onTouched?: () => void;

  constructor() {}

  public writeValue(value: string) {
    this.value = value ?? '';
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

  public onValueChange(val: string) {
    this.value = val;
    if(this.onChange) {
      this.onChange(val);
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
