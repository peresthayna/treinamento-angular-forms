import { delay, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerificaEmailService {

  constructor(private http: HttpClient) { }

  verificarEmail(email: string)
  {
    return this.http.get('assets/dados/verificarEmail.json')
    .pipe(
      delay(2000),
      map((dados: any) => dados.emails),
      map((dados: any) => dados.filter(v => v.email === email)),
      map((dados: any) => dados.length > 0)
    );

  }
}
