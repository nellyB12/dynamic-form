import { Routes } from '@angular/router';
import { DynamicFormBuilderComponent } from './dynamic-form-builder/dynamic-form-builder.component';

export const routes: Routes = [
    {path: 'form-builder', component: DynamicFormBuilderComponent},
    {path: '', redirectTo: '/form-builder', pathMatch: 'full' },
];
