import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { Component } from '@angular/core';
import { OptionItem } from '../dynamic-form-builder.model';

// Test host component to provide required inputs
@Component({
  template: `
    <app-select
      [name]="name"
      [id]="id"
      [options]="options"
      [placeholder]="placeholder"
      [isInvalid]="isInvalid"
    ></app-select>
  `,
  imports: [SelectComponent]
})
class TestHostComponent {
  name: string = '';
  id: string = '';
  options: OptionItem[] = [];
  placeholder: string = '';
  isInvalid: boolean = false;
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, SelectComponent]
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
