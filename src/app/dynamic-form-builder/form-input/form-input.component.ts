import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import { DynamicFormBuilderService } from '../services/dynamic-form-builder.service';

@Component({
  selector: 'app-form-input',
  imports: [FormsModule, CodemirrorModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements OnInit {
  public schemaContent = signal<string>('');
  public schemaContentError = signal<string | null>(null);

  constructor(private dynamicFormBuilderService: DynamicFormBuilderService) {}

  ngOnInit() {}

  onChangeSchemaContent(value: string) {
    this.schemaContent.set(value);
    this.schemaContentError.set(null);
    if(!value) {
      this.dynamicFormBuilderService.currentState = null;
    } else {
      try {
        const newValue = JSON.parse(value);
        this.dynamicFormBuilderService.currentState = newValue;
      } catch (e) {
        this.schemaContentError.set('Schema content is not valid JSON');
        this.dynamicFormBuilderService.currentState = null;
      }
    }
  }
}
