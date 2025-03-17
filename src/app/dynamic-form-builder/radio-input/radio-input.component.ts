import { Component, forwardRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OptionItem } from '../dynamic-form-builder.model';

@Component({
  selector: 'app-radio-input',
  imports: [FormsModule, CommonModule, RadioButtonModule],
  templateUrl: './radio-input.component.html',
  styleUrl: './radio-input.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioInputComponent),
    multi: true
  }]
})
export class RadioInputComponent implements ControlValueAccessor {
  public name = input.required<string>();
  public options = input.required<OptionItem[]>();
  public selectedOption?: OptionItem;
  public onChange?: (value: any) => void;
  public onTouched?: () => void;

  constructor() {}

  writeValue(value: string) {
    this.selectedOption = this.options()?.find((option) => option.value === value);
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onSelectedOptionChange(event: OptionItem) {
    this.selectedOption = event;
    if(this.onChange) {
      this.onChange(event.value);
    }
    if(this.onTouched) {
      this.onTouched();
    }
  }
}
