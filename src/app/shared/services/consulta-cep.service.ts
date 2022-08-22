import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep: string)
  {
    cep = cep.replace(/\D/g, '');
    if(cep != '')
    {
      let validacep = /^[0-9]{8}$/;
      if(validacep.test(cep))
      {
        return this.http.get(`//viacep.com.br/ws/${cep}/json/`);
      }
    }
    return of({});
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
