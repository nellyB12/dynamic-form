import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInputComponent } from './form-input.component';
import { DynamicFormBuilderService } from '../dynamic-form-builder.service';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { FieldType, State, ValidationType } from '../dynamic-form-builder.model';

const validJsonOne = `{
  "name": "Simple form",
  "button": "Next",
  "layout": {
  	"breakpoint": 768,
  	"gutters": {
  		"horizontal": 4,
  		"vertical": 3
  	}
  },
  "fields": [
  	{
      "name": "firstName",
      "type": "text",
      "label": "First name",
      "width": 50,
      "placeholder": "John",
      "required": true,
      "validations": [
        { "type": "required", "message": "First name is required" }
      ]
    }
  ]
}`;

const parsedJsonOne: State = {
  name: "Simple form",
  button: "Next",
  layout: {
  	breakpoint: 768,
  	gutters: {
  		horizontal: 4,
  		vertical: 3
  	}
  },
  fields: [
  	{
      name: "firstName",
      type: "text" as FieldType,
      label: "First name",
      width: 50,
      placeholder: "John",
      required: true,
      validations: [
        { type: "required" as ValidationType, message: "First name is required" }
      ]
    }
  ]
};

describe('FormInputComponent', () => {
  let component: FormInputComponent;
  let fixture: ComponentFixture<FormInputComponent>;
  let dynamicFormBuilderService: jasmine.SpyObj<DynamicFormBuilderService> & { currentState: State | null };;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DynamicFormBuilderService', [], {'currentState': null});
    Object.defineProperty(spy, 'currentState', {
      writable: true,
      configurable: true,
      value: null
    });

    await TestBed.configureTestingModule({
      imports: [FormInputComponent, FormsModule, CodemirrorModule],
      providers: [
        { provide: DynamicFormBuilderService, useValue: spy }
      ]
    })
    .compileComponents();
    dynamicFormBuilderService = TestBed.inject(DynamicFormBuilderService) as jasmine.SpyObj<DynamicFormBuilderService> & { currentState: State | null };;

    fixture = TestBed.createComponent(FormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty schema content and no error', () => {
    expect(component.schemaContent()).toBe('');
    expect(component.schemaContentError()).toBeNull();
  });

  describe('onChangeSchemaContent', () => {
    it('should update schemaContent signal with new value', () => {
      const testValue = '{"test": "value"}';
      component.onChangeSchemaContent(testValue);
      expect(component.schemaContent()).toBe(testValue);
    });

    it('should clear error when new value is provided', () => {
      component.schemaContentError.set('Some error');
      component.onChangeSchemaContent('{"valid": "json"}');
      expect(component.schemaContentError()).toBeNull();
    });

    it('should parse valid JSON and update service currentState', () => {
      component.onChangeSchemaContent(validJsonOne);
      expect(component.schemaContent()).toBe(validJsonOne);
      expect(component.schemaContentError()).toBeNull();
      expect(dynamicFormBuilderService.currentState).toEqual(parsedJsonOne);
    });

    it('should set currentState to null when value is empty', () => {
      component.onChangeSchemaContent('');
      expect(dynamicFormBuilderService.currentState).toBeNull();
    });

    it('should set error and null currentState for invalid JSON', () => {
      const invalidJson = '{name: "test"'; // Missing closing brace
      component.onChangeSchemaContent(invalidJson);
      expect(component.schemaContentError()).toBe('Schema content is not valid JSON');
      expect(dynamicFormBuilderService.currentState).toBeNull();
    });
  });

  it('should display error message in template when schemaContentError exists', () => {
    component.schemaContentError.set('Test error');
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toBe('Test error');
  });

  it('should not display error message when schemaContentError is null', () => {
    component.schemaContentError.set(null);
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement).toBeNull();
  });
});
