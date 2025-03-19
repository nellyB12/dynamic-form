import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextInputComponent } from './text-input.component';
import { Component } from '@angular/core';

// Test host component to provide required inputs
@Component({
  template: `
    <app-text-input
      [name]="name"
      [id]="id"
      [placeholder]="placeholder"
      [isInvalid]="isInvalid"
    ></app-text-input>
  `,
  imports: [TextInputComponent]
})
class TestHostComponent {
  name: string = '';
  id: string = '';
  placeholder: string = '';
  isInvalid: boolean = false;
}

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TextInputComponent]
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
