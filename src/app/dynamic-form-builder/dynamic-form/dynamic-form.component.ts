import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormBuilderService } from '../services/dynamic-form-builder.service';
import { State, FormField, FieldType, Layout, Width } from '../dynamic-form-builder.model';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import { ButtonComponent } from '../button/button.component';
import { LayoutFactoryService } from '../services/layout-factory.service';
import { VisibilityFactoryService } from '../services/visibility-factory.service';
import { ValidationFactoryService } from '../services/validation-factory.service';
import { DataApiService } from '../data-api.service';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FormFieldComponent, ButtonComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public fields = signal<FormField[]>([]);
  public formName = signal<string | null>(null);
  public buttonLabel = signal<string | null>(null);
  public layout = signal<Layout | null>(null);
  public rowClassName = computed(() => {
    if(!this.layout()?.gutters) {
      return 'gx-3 gy-4';
    }
    const horizontalGutter = this.layout()?.gutters?.horizontal;
    const verticalGutter = this.layout()?.gutters?.vertical;
    if(horizontalGutter == 0 && verticalGutter == 0) {
      return 'g-0';
    }
    if(horizontalGutter === verticalGutter) {
      return `g-${horizontalGutter}`;
    }
    return `gx-${horizontalGutter} gy-${verticalGutter}`;
  });
  public form!: FormGroup;
  public readonly defaultButtonLabel = 'Submit';
  public readonly fieldType = FieldType;

  constructor(
    private dynamicFormBuilderService: DynamicFormBuilderService,
    private layoutFactoryService: LayoutFactoryService,
    private visibilityFactoryService: VisibilityFactoryService,
    private validationFactoryService: ValidationFactoryService,
    private dataApiService: DataApiService
  ) {}

  ngOnInit() {
    this.subscription.add(this.dynamicFormBuilderService.currentState$.subscribe({
      next: (currentState: State | null) => {
        this.fields.set(currentState?.fields ?? []);
        this.formName.set(currentState?.name ?? '');
        this.buttonLabel.set(currentState?.submitLabel ?? this.defaultButtonLabel);
        this.layout.set(currentState?.layout ?? null);
        if(currentState) {
          this.form = this.dynamicFormBuilderService.createNewForm(currentState);
          this.visibilityFactoryService.initFieldsMap(this.fields(), this.form);
          // dynamic validations init
          this.validationFactoryService.calcDynamicSourceFields(this.fields());

          // read data from external API
          this.readDataAndUpdateForm(currentState);
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

  public getFieldClassName(field: FormField) {
    const fieldWidth = field?.width ?? Width.FullWidth;
    return this.layoutFactoryService.getColumnClassName(fieldWidth, this.layout()?.breakpoint);
  }

  public isVisible(field: FormField): boolean {
    return this.visibilityFactoryService.getFieldVisibility(field.name, field?.visibleIf?.field, field?.visibleIf?.value);
  }

  private updateFormValueFromResponse(form: FormGroup, fields: FormField[], response: any) {
    if(!response || !form || !fields) {
      return;
    }
    fields.forEach((field: FormField) => {
      if(field.type == FieldType.Group) {
        const nestedForm = form.get(field.name)! as FormGroup;
        this.updateFormValueFromResponse(nestedForm, field.fields!, response);
      } else {
        const found = Object.keys(response).includes(field.name);
        if(found) {
          form.get(field.name)?.setValue(response[field.name]);
        }
      }
    });
  }

  private readDataAndUpdateForm(currentState: State) {
    if(currentState?.getDataApi && currentState.getDataApi.length > 0) {
      currentState.getDataApi.forEach((dataApiUrl: string) => {
        let apiCallFn: (url: string) => Observable<{data: any}>;
        if(dataApiUrl === this.dataApiService.personApiUrl) {
          apiCallFn = this.dataApiService.getCurrentUser;
        } else if(dataApiUrl === this.dataApiService.companyApiUrl) {
            apiCallFn = this.dataApiService.getCurrentCompany;
        } else {
          throw new Error(`${dataApiUrl} API not found`);
        }
        if(apiCallFn) {
          apiCallFn(dataApiUrl).subscribe((response) => {
            if(response?.data) {
              this.updateFormValueFromResponse(this.form, this.fields(), response?.data);
            }
          });
        }
      });
    }
  }
}
