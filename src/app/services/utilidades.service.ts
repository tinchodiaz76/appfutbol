import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {
  fecha: string='';

  constructor(private router: Router) { }

  buscar(dia: number)
  {
      let proximoPartido;
      const diaRequerido = dia;
      let hoy = moment().isoWeekday();
//      let hoy= 5
//Viernes 24 HOY=5
//Martes 28 DIAREQUERIDO=2
      if (hoy <= diaRequerido) 
      {
        if (hoy!=diaRequerido)
        {
          //PROBADO UN DIA LUNES, CON DIAREQUERIDO=6(SABADO)
          proximoPartido= moment().isoWeekday()+(diaRequerido-hoy);

          return moment().day(proximoPartido).format('L');
        }
        else
        {
          return moment().format('L')
        }
      } 
      else 
      {
//        window.alert('222222222');
        //7-2=5
//          window.alert('33333333');
          if (hoy===7 && (hoy!=diaRequerido))
          {
            //PROBADO UN DIA DOMINGO, CON DIAREQUERIDO=3 O 6(SABADO)
            proximoPartido= moment().add(1, 'weeks').isoWeekday()-(hoy-diaRequerido);
//            window.alert('proximoPartido-0='+ proximoPartido);
            return moment().day(proximoPartido).format('L');
          }
          else
          {
            if (hoy!=diaRequerido)
            {
//              window.alert('entrooooo');
            //PROBADO UN DIA MARTES, CON DIAREQUERIDO=1(LUNES)
              proximoPartido= moment().add(1, 'weeks').isoWeekday()+(diaRequerido-hoy);
//              window.alert('proximoPartido-1='+proximoPartido);
              return moment().add(1, 'weeks').day(proximoPartido).format('L');
            }
            else
            {
              return moment().format('L');
            }
          }
      }
  }
  
  refreshRoute(idGrupo: string)
  {
  this.router.navigateByUrl('/RefrshComponent', {skipLocationChange: true})
  .then(()=> this.router.navigate(['grupo', idGrupo]));
  }
}
