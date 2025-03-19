import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxBinaryInputComponent } from './checkbox-binary-input.component';
import { Component } from '@angular/core';

// Test host component to provide required inputs
@Component({
  template: `
    <app-checkbox-binary-input
      [name]="name"
      [id]="id"
      [label]="label"
    ></app-checkbox-binary-input>
  `,
  imports: [CheckboxBinaryInputComponent]
})
class TestHostComponent {
  name: string = '';
  id: string = '';
  label: string = '';
}

describe('CheckboxBinaryInputComponent', () => {
  let component: CheckboxBinaryInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, CheckboxBinaryInputComponent]
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
