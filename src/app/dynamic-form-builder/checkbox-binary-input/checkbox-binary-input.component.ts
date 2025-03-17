import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-checkbox-binary-input',
  imports: [FormsModule, CheckboxModule],
  templateUrl: './checkbox-binary-input.component.html',
  styleUrl: './checkbox-binary-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxBinaryInputComponent),
    multi: true
  }]
})
export class CheckboxBinaryInputComponent implements ControlValueAccessor {
  public name = input.required<string>();
  public id = input.required<string>();
  public label = input.required<string>();
  public value: boolean = false;
  public onChange?: (value: boolean) => void;
  public onTouched?: () => void;

  constructor() {}

  public writeValue(value: boolean) {
    this.value = value;
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onValueChange(event: any) {
    this.value = event;
    if(this.onChange) {
      this.onChange(this.value);
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
