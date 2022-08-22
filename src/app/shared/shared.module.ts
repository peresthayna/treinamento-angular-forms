import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DropdownService } from './services/dropdown.service';
import { CampoControlErroComponent } from './../shared/campo-control-erro/campo-control-erro.component';
import { FormDebugComponent } from './../shared/form-debug/form-debug.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { InputFieldComponent } from './input-field/input-field.component';

@NgModule({
  declarations: [
    FormDebugComponent,
    CampoControlErroComponent,
    ErrorMsgComponent,
    InputFieldComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    FormDebugComponent,
    CampoControlErroComponent,
    ErrorMsgComponent,
    InputFieldComponent
  ],
  providers: [
    DropdownService
  ]
})
export class SharedModule { }
