import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormBuilderService } from '../dynamic-form-builder.service';
import { LayoutFactoryService } from '../layout-factory.service';
import { VisibilityFactoryService } from '../visibility-factory.service';
import { ValidationFactoryService } from '../validation-factory.service';
import { DataApiService } from '../data-api.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import { ButtonComponent } from '../button/button.component';
import { BehaviorSubject, of } from 'rxjs';
import { State, FormField, FieldType, Validation, ValidationType } from '../dynamic-form-builder.model';
import { Person, Company } from '../data-api.model';

export const currentUser: Person = {
    id: "23678",
    firstName: "Lara",
    lastName: "Tompson",
    phoneNumber: "+19786159222",
    email: "lara_tompson79@gmail.com",
    ssnNumber: "876-42-8723",
    idNumber: "9809116532",
    dateOfBirth: "09/11/98",
    married: false
};

export const currentCompany: Company = {
    id: "69023451",
    companyName: "Samle Company Name & Partners",
    companyEmail: "office_sample_cp43@gmail.com",
    countryOfOperation: "United States"
};

const firstNameFormField = {
  name: "firstName",
  type: "text" as FieldType,
  label: "First name",
  width: 50,
  placeholder: "John",
  required: true,
  validations: [
    { type: "required" as ValidationType, message: "First name is required" },
    { type: "minLength" as ValidationType, value: "2", message: "First name should be at least 2 characters" },
    { type: "maxLength" as ValidationType, value: "30", message: "First name should be max 30 characters" }
  ]
}

const reasonFormField = {
  name: "reason",
  type: "dropdown" as FieldType,
  label: "Reason",
  width: 50,
  visibleIf: {
    field: "insuranceType",
    value: "travel"
  },
  placeholder: "Please select",
  required: false,
  lookupApi: "/travel-ins-reasons",
  validations: []
}

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let dynamicFormBuilderService: jasmine.SpyObj<DynamicFormBuilderService> & { formValue: any };
  let layoutFactoryService: jasmine.SpyObj<LayoutFactoryService>;
  let visibilityFactoryService: jasmine.SpyObj<VisibilityFactoryService>;
  let validationFactoryService: jasmine.SpyObj<ValidationFactoryService>;
  let dataApiService: jasmine.SpyObj<DataApiService>;
  let stateSubject: BehaviorSubject<State | null>;

  beforeEach(async () => {
    stateSubject = new BehaviorSubject<State | null>(null);
    const spy = jasmine.createSpyObj('DynamicFormBuilderService', 
      ['createNewForm'], 
      { currentState$: stateSubject.asObservable(), formValue: null }
    );
    // Make formValue writable
    Object.defineProperty(spy, 'formValue', {
      writable: true,
      configurable: true,
      value: null
    });

    layoutFactoryService = jasmine.createSpyObj('LayoutFactoryService', ['getColumnClassName']);
    visibilityFactoryService = jasmine.createSpyObj('VisibilityFactoryService', ['getFieldVisibility', 'initFieldsMap']);
    validationFactoryService = jasmine.createSpyObj('ValidationFactoryService', ['getSourceFieldTarget', 'calcDynamicSourceFields']);
    dataApiService = jasmine.createSpyObj('DataApiService', ['getCurrentUser', 'getCurrentCompany'], {
      personApiUrl: '/user/23678',
      companyApiUrl: '/company/69023451'
    });

    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent, FormFieldComponent, ButtonComponent, FormsModule, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: DynamicFormBuilderService, useValue: spy },
        { provide: LayoutFactoryService, useValue: layoutFactoryService },
        { provide: VisibilityFactoryService, useValue: visibilityFactoryService },
        { provide: ValidationFactoryService, useValue: validationFactoryService },
        { provide: DataApiService, useValue: dataApiService }
      ]
    })
    .compileComponents();

    // Mock default returns
    dynamicFormBuilderService = TestBed.inject(DynamicFormBuilderService) as jasmine.SpyObj<DynamicFormBuilderService> & { formValue: any };
    layoutFactoryService.getColumnClassName.and.returnValue('col-12 col-md-6');
    visibilityFactoryService.getFieldVisibility.and.returnValue(true);
    validationFactoryService.getSourceFieldTarget.and.returnValue(new Set(['idNumber']));
    validationFactoryService.calcDynamicSourceFields.and.callThrough;
    dataApiService.getCurrentUser.and.returnValue(of({ data: currentUser }));
    dataApiService.getCurrentCompany.and.returnValue(of({ data: currentCompany }));

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form and signals with currentState', () => {
      const testState: State = {
        fields: [firstNameFormField],
        name: 'Test Form',
        submitLabel: 'Save',
        layout: { breakpoint: 992, gutters: { horizontal: 3, vertical: 4 } }
      };
      stateSubject.next(testState);
      
      expect(component.fields()).toEqual(testState.fields);
      expect(component.formName()).toBe('Test Form');
      expect(component.buttonLabel()).toBe('Save');
      expect(component.layout()).toEqual(testState.layout || null);

      expect(dynamicFormBuilderService.createNewForm).toHaveBeenCalledWith(testState);
      expect(visibilityFactoryService.initFieldsMap).toHaveBeenCalledWith(component.fields(), component!.form);
    });
  });

  describe('rowClassName', () => {
    it('should compute default class when no layout', () => {
      component.layout.set(null);
      expect(component.rowClassName()).toBe('gx-3 gy-4');
    });

    it('should compute class based on layout gutters', () => {
      component.layout.set({ breakpoint: 992, gutters: { horizontal: 2, vertical: 2 } });
      expect(component.rowClassName()).toBe('g-2');
      
      component.layout.set({ breakpoint: 992, gutters: { horizontal: 1, vertical: 3 } });
      expect(component.rowClassName()).toBe('gx-1 gy-3');

      component.layout.set({ breakpoint: 992, gutters: { horizontal: 0, vertical: 0 } });
      expect(component.rowClassName()).toBe('g-0');
    });
  });

  describe('onSubmit', () => {
    it('should set formValue when form is valid', () => {
      component.form = new FormGroup({test: new FormControl('value')});
      spyOn(component.form.valid, 'valueOf').and.returnValue(true);
      spyOn(component.form, 'getRawValue').and.returnValue({ test: 'value' });
      component.onSubmit();
      expect(dynamicFormBuilderService.formValue).toEqual({ test: 'value' });
    });
  });

  describe('template rendering', () => {
    it('should render form when fields exist', () => {
      component.fields.set([firstNameFormField]);
      component.form = new FormGroup({firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)])});
      fixture.detectChanges();
      
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should render form title when formName exists', () => {
      component.fields.set([firstNameFormField]);
      component.form = new FormGroup({firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)])});
      component.formName.set('Test Form');
      fixture.detectChanges();
      
      const title = fixture.nativeElement.querySelector('.form-title');
      expect(title.textContent).toBe('Test Form');
    });

    it('should render fields with correct class', () => {
      component.fields.set([firstNameFormField]);
      component.form = new FormGroup({firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)])});
      fixture.detectChanges();
      
      const fieldDiv = fixture.nativeElement.querySelector('.col-12.col-md-6');
      expect(fieldDiv).toBeTruthy();
    });

    it('should disable button when form is invalid', () => {
      component.fields.set([firstNameFormField]);
      component.form = new FormGroup({firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)])});
      spyOn(component.form.invalid, 'valueOf').and.returnValue(true);
      fixture.detectChanges();
      
      const button = fixture.nativeElement.querySelector('app-button');
      expect(button.getAttribute('ng-reflect-disabled')).toBe('true');
    });
  });

  describe('getFieldClassName', () => {
    it('should return class from layoutFactoryService', () => {
      const field = firstNameFormField;
      const result = component.getFieldClassName(field);
      expect(result).toBe('col-12 col-md-6');
      expect(layoutFactoryService.getColumnClassName).toHaveBeenCalledWith(50, undefined);
    });
  });

  describe('isVisible', () => {
    it('should return visibility from visibilityFactoryService', () => {
      const field = reasonFormField;
      const result = component.isVisible(field);
      expect(result).toBe(true);
      expect(visibilityFactoryService.getFieldVisibility).toHaveBeenCalledWith('reason', 'insuranceType', 'travel');
    });
  });
});
