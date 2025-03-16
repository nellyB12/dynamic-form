import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormBuilderService } from '../dynamic-form-builder.service';
import { State, FormField, FieldType } from '../dynamic-form-builder.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FormFieldComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public fields = signal<FormField[]>([]);
  public formName = signal<string | null>(null);
  public buttonLabel = signal<string | null>(null);
  public form!: FormGroup;
  public readonly defaultButtonLabel = 'Submit';
  public readonly fieldType = FieldType;

  constructor(private dynamicFormBuilderService: DynamicFormBuilderService) {
  }

  ngOnInit() {
    this.subscription.add(this.dynamicFormBuilderService.currentState$.subscribe({
      next: (currentState: State | null) => {
        this.fields.set(currentState?.fields ?? []);
        this.formName.set(currentState?.name ?? '');
        this.buttonLabel.set(currentState?.button ?? this.defaultButtonLabel);
        if(currentState) {
          this.form = this.dynamicFormBuilderService.createNewForm(currentState);
        }
      }
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onSubmit() {
    if(this.form.valid) {
      this.dynamicFormBuilderService.formValue = this.form.getRawValue();
    } else {
      console.log("form invalid");
    }
  }

  public getFormGroup(field: FormField) {
    return this.form.get(field.name) as FormGroup;
  }
}
