import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {
  fecha: string='';

  constructor() { }

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
        if (hoy==diaRequerido)
        {
          return moment().add(1,'weeks').format('L');
        }
        else
        {
          proximoPartido= moment().isoWeekday()+(diaRequerido-hoy);

          return moment().day(proximoPartido).format('L');
        }
      } 
      else 
      {
//        window.alert('222222222');
        //7-2=5
//          window.alert('33333333');
          if (hoy===7)
          {
            //PROBADO
            proximoPartido= moment().add(1, 'weeks').isoWeekday()-(hoy-diaRequerido);
//            window.alert('proximoPartido-0='+ proximoPartido);
            return moment().day(proximoPartido).format('L');
          }
          else
          {
//            window.alert('entrooooo');
            proximoPartido= moment().add(1, 'weeks').isoWeekday()+(diaRequerido-hoy);
//            window.alert('proximoPartido-1='+proximoPartido);
            return moment().day(proximoPartido).format('L');
          }
/*        
        else
        {
//          window.alert('44444444');
          proximoPartido= moment().add(1, 'weeks').isoWeekday() - (hoy-diaRequerido);
          window.alert('proximoPartido-2='+proximoPartido);
          return moment().add(1, 'weeks').day(proximoPartido).format('L');
        }
      }
*/      
      }
  }
}
