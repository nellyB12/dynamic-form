import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxInputComponent } from './checkbox-input.component';
import { Component } from '@angular/core';
import { OptionItem } from '../dynamic-form-builder.model';

// Test host component to provide required inputs
@Component({
  template: `
    <app-checkbox-input
      [name]="name"
      [options]="options"
    ></app-checkbox-input>
  `,
  imports: [CheckboxInputComponent]
})
class TestHostComponent {
  name: string = '';
  options: OptionItem[] = [];
}

describe('CheckboxInputComponent', () => {
  let component: CheckboxInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxInputComponent, TestHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
