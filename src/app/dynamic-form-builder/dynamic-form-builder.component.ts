import { Component } from '@angular/core';
import { FormInputComponent } from './form-input/form-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormOutputComponent } from './form-output/form-output.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-dynamic-form-builder',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormInputComponent,
    FormOutputComponent,
    DynamicFormComponent
  ],
  templateUrl: './dynamic-form-builder.component.html',
  styleUrl: './dynamic-form-builder.component.scss'
})
export class DynamicFormBuilderComponent {

}
