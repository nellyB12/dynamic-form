import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { Subscription } from 'rxjs';
import { DynamicFormBuilderService } from '../dynamic-form-builder.service';

@Component({
  selector: 'app-form-output',
  imports: [FormsModule, CodemirrorModule],
  templateUrl: './form-output.component.html',
  styleUrl: './form-output.component.scss'
})
export class FormOutputComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public schemaResult = signal<string>('');

  constructor(private dynamicFormBuilderService: DynamicFormBuilderService) {}

  ngOnInit() {
    this.subscription.add(this.dynamicFormBuilderService.formValue$.subscribe({
      next:(formValue) => {
          this.schemaResult.set(this.dynamicFormBuilderService.prepareFormResultAsJSON(formValue));
      }
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onChangeSchemaResult(value: string) {
    this.schemaResult.set(value);
  }
}
