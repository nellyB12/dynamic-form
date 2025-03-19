import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';
import { Component } from '@angular/core';

// Test host component to provide required inputs
@Component({
  template: `
    <app-textarea
      [name]="name"
      [id]="id"
      [placeholder]="placeholder"
      [isInvalid]="isInvalid"
    ></app-textarea>
  `,
  imports: [TextareaComponent]
})
class TestHostComponent {
  name: string = '';
  id: string = '';
  placeholder: string = '';
  isInvalid: boolean = false;
}

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TextareaComponent]
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
