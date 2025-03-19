import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioInputComponent } from './radio-input.component';
import { Component } from '@angular/core';
import { OptionItem } from '../dynamic-form-builder.model';

// Test host component to provide required inputs
@Component({
  template: `
    <app-radio-input
      [name]="name"
      [options]="options"
    ></app-radio-input>
  `,
  imports: [RadioInputComponent]
})
class TestHostComponent {
  name: string = '';
  options: OptionItem[] = [];
}

describe('RadioInputComponent', () => {
  let component: RadioInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, RadioInputComponent]
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
