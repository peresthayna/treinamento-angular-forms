import { FormGroup, FormArray } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent {

  formulario: FormGroup;

  constructor() { }

  abstract submit();

  onSubmit() {
    if(this.formulario.valid)
    { this.submit(); }
    else
    { this.verificaValidacoesForm(this.formulario); }
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray)
  {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if(controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificaValidacoesForm(controle);
      }
    })
  }

  resetar(): void{ 
    this.formulario.reset(); }
  
    validarCampo(campo) { 
      return !this.formulario.get(campo)?.valid && (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty); }
  
    validarRequired(campo) {
      return !this.formulario.get(campo)?.hasError('required') &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty);
    }
  
    validarEmail() {
      let campoEmail = this.formulario.get('email')
      if(campoEmail?.errors)
      { return campoEmail?.errors['email'] && campoEmail.touched }
    }
  
    aplicarCss(campo) {
      return {
        'is-invalid': this.validarCampo(campo),
      }
    }
  
    aplicarCssInvalidFeedback(campo) {
      return {
        'text-danger': this.validarCampo(campo)}
    }

    getCampo(campo: string) {
      return this.formulario.get(campo);
    }


}
