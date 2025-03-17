import { CommonModule } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-textarea',
  imports: [FormsModule, CommonModule, TextareaModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent),
    multi: true
  }],
})
export class TextareaComponent implements ControlValueAccessor {
  public name = input.required<string>();
  public id = input.required<string>();
  public placeholder = input<string>();
  public isInvalid = input<boolean>();
  public value?: string;
  public disabled: boolean = false;
  public onChange?: (value: string) => void;
  public onTouched?: () => void;

  constructor() {}

  public writeValue(value: string) {
    this.value = value ?? '';
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
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
