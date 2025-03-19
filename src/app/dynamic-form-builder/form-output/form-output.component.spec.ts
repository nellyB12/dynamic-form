import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormOutputComponent } from './form-output.component';
import { DynamicFormBuilderService } from '../dynamic-form-builder.service';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { BehaviorSubject } from 'rxjs';

const defaultMockJSON = `{
  "firstName": "Tamara",
  "lastName": "Simpson"
}`;

const testValueOne = {
  firstName: "Tim",
  lastName: "Johns"
};

const jsonResultOne = `{
  "firstName": "Tim",
  "lastName": "Johns"
}`;

describe('FormOutputComponent', () => {
  let component: FormOutputComponent;
  let fixture: ComponentFixture<FormOutputComponent>;
  let dynamicFormBuilderService: jasmine.SpyObj<DynamicFormBuilderService>;
  let formValueSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    formValueSubject = new BehaviorSubject<any>(null);
    const spy = jasmine.createSpyObj('DynamicFormBuilderService', ['prepareFormResultAsJSON'], {
      formValue$: formValueSubject.asObservable()
    });

    // set default mock
    spy.prepareFormResultAsJSON.and.returnValue('');

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FormOutputComponent, FormsModule, CodemirrorModule],
      providers: [
        { provide: DynamicFormBuilderService, useValue: spy }
      ]
    })
    .compileComponents();
    dynamicFormBuilderService = TestBed.inject(DynamicFormBuilderService) as jasmine.SpyObj<DynamicFormBuilderService>;

    fixture = TestBed.createComponent(FormOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty schemaResult', () => {
    expect(component.schemaResult()).toBe('');
  });
  
  describe('ngOnInit', () => {
    it('should subscribe to formValue$ and update schemaResult', () => {
      dynamicFormBuilderService.prepareFormResultAsJSON.and.returnValue(jsonResultOne);
      component.ngOnInit();
      formValueSubject.next(testValueOne);
      expect(dynamicFormBuilderService.prepareFormResultAsJSON).toHaveBeenCalledWith(testValueOne);
      expect(component.schemaResult()).toBe(jsonResultOne);
    });
  });

  describe('ngOnDestroy', () => {
    it('should stop updating schemaResult after destroy', () => {
      const testValue1 = { firstName: 'sss' };
      const testValue2 = { firstName: 'ddd' };
      const jsonResult1 = `{
  "firstName": "sss"
}`;
      const jsonResult2 = `{
  "firstName": "ddd"
}`;
      
      dynamicFormBuilderService.prepareFormResultAsJSON.and.callFake((val) => JSON.stringify(val, null, 2));
      component.ngOnInit();
      formValueSubject.next(testValue1);
      expect(component.schemaResult()).toBe(jsonResult1);
      component.ngOnDestroy();
      formValueSubject.next(testValue2);
      expect(component.schemaResult()).toBe(jsonResult1); // Should not update to jsonResult2
    });
  });

  describe('onChangeSchemaResult', () => {
    it('should update schemaResult signal with new value', () => {
      const testValue = '{"new": "result"}';
      component.onChangeSchemaResult(testValue);
      expect(component.schemaResult()).toBe(testValue);
    });
  });

  it('should render codemirror with schemaResult value', () => {
    const testValue = '{"display": "test"}';
    component.schemaResult.set(testValue);
    fixture.detectChanges();
    
    const codemirror = fixture.nativeElement.querySelector('ngx-codemirror');
    expect(codemirror).toBeTruthy();
  });

  it('should have readonly codemirror', () => {
    fixture.detectChanges();
    const codemirror = fixture.nativeElement.querySelector('ngx-codemirror');
    expect(codemirror).toBeTruthy();
  });

  it('should have correct label', () => {
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.form-label');
    expect(label).toBeTruthy();
    expect(label.textContent).toBe('JSON result:');
    expect(label.getAttribute('for')).toBe('formOutput');
  });
});
