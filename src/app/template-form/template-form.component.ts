import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {
  
  usuario: any = { nome: null, email: null };

  onSubmit(form)
  {
    this.http.post('https://httpbin.org/post', JSON.stringify(form.value))
    .pipe(map((resp: any) => resp)).subscribe(dados => console.log(form));
  }

  constructor(private http: HttpClient, private cepService: ConsultaCepService) { }

  ngOnInit(): void {
    
  }

  validarCampo(campo)
  {
    return !campo.valid && campo.touched;
  }

  aplicarCss(campo) {
    return {
      'has-error': this.validarCampo(campo),
      'has-feedback': this.validarCampo(campo)}
  }
  
  consultaCEP(cep, form)
  {
    cep.value = cep.value.replace(/\D/g, '');
    if(cep.value !== '' && cep.value != null)
    {
      this.cepService.consultaCEP(cep.value)?.subscribe(dados => this.populaDadosForm(dados, form));
    }
  }

  populaDadosForm(dados, formulario)
  {
    formulario.form.patchValue({
      "endereco": {
        "complemento": dados.complemento,
        "rua": dados.logradouro,
        "bairro": dados.bairro,
        "cidade": dados.localidade,
        "estado": dados.uf
      }
    })
  }

  resetaDadosForm(formulario)
  {
    formulario.form.patchValue({
      "endereco": {
        "complemento": null,
        "rua": null,
        "bairro": null,
        "cidade": null,
        "estado": null
      }
    })
  }

}
