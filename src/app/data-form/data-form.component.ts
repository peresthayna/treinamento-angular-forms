import { Cidade } from './../shared/models/cidade';
import { VerificaEmailService } from './services/verifica-email.service';
import { FormValidations } from './../shared/form-validations';
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { EstadoBr } from './../shared/models/estado-br';
import { DropdownService } from './../shared/services/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { distinctUntilChanged, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { BaseFormComponent } from '../shared/base-form/base-form.component';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  //formulario: FormGroup;
  estados: EstadoBr[];
  cidades: Cidade[];
  //estados: Observable<EstadoBr[]>;
  cargos: any[];
  tecnologias: any[];
  newsletterOptions: any[];

  frameworks: string[] = ['Angular','React','Vue','Sencha'];

  constructor(private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService) { super(); }

  ngOnInit(): void {
    this.verificaEmailService.verificarEmail('email@email.com').subscribe();

    //this.estados = this.dropdownService.getEstadosBr();
    this.dropdownService.getEstadosBr()
      .subscribe((dados:any) => { this.estados = dados; console.log(dados);})

    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOptions = this.dropdownService.getNewsletter();

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email], [this.validacaoEmail.bind(this)]],
      confirmarEmail: [null, FormValidations.equalsTo('email')],

      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: [null],
      termos: [false, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    });

    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(),
        switchMap(status => status === 'VALID' ? 
          this.cepService.consultaCEP(this.formulario.get('endereco.cep')?.value) : EMPTY
        )
      )
      .subscribe(dados => dados ? this.populaDadosForm(dados) : {});

      this.formulario.get('endereco.estado')?.valueChanges
      .pipe(
        tap(console.log),
        map(estado => this.estados.filter(e => e.sigla === estado)),
        tap(console.log), 
        map(estados => estados && estados.length > 0 ? estados[0].id : 0),
        switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId))
      )
      .subscribe(cidades => this.cidades = cidades);
  }

  buildFrameworks()
  {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinCheck(1));
  }

  submit()
  {
    let valueSubmit = Object.assign({}, this.formulario.value);
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v, i) => v ? this.frameworks[i] : null)
      .filter(v => v !== null)
    })
    this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit))
    .pipe(map((resp: any) => resp))
    .subscribe(dados => {
      console.log(this.formulario);
      this.resetar();
    },
    (error: any) => alert('erro'))
  }

  consultaCEP()
  {
    let cep = this.formulario.get('endereco.cep')?.value;

    if(cep != '')
    {
      let validacep = /^[0-9]{8}$/;
      if(validacep.test(cep))
      {
        this.resetaDadosForm();

        this.http.get(`//viacep.com.br/ws/${cep}/json/`);
      }
    }
  }

  resetaDadosForm()
  {
    this.formulario.patchValue({
      "endereco": {
        "complemento": null,
        "rua": null,
        "bairro": null,
        "cidade": null,
        "estado": null
      }
    })
  }

  populaDadosForm(dados)
  {
    this.formulario.patchValue({
      "endereco": {
        "complemento": dados.complemento,
        "rua": dados.logradouro,
        "bairro": dados.bairro,
        "cidade": dados.localidade,
        "estado": dados.uf
      }
    })
  }

  setarCargo()
  {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'};
    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargos(obj1, obj2)
  {
    return obj1 && obj2 ? (obj1.nome === obj2.nome) : obj1 === obj2;
  }

  setarTecnologias()
  {
    this.formulario.get('tecnologias')?.setValue(['java','javascript','php']);
  }

  validacaoEmail(formControl: FormControl)
  {
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? {emailInvalido: true} : null));
  }
}
