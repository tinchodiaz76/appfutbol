import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {
  fecha: string='';

  constructor() { }

  sumarDias(fecha: Date, dias: number) :string
  {
    fecha.setDate(fecha.getDate() + dias);

    if (fecha.getDate()<10)
    {
      if ((fecha.getMonth()+1)<10)
        this.fecha= fecha.getFullYear() + `0${fecha.getMonth()+1}` +`0${fecha.getDate()}`;
      else
        this.fecha= fecha.getFullYear() + `0${fecha.getMonth()+1}` +`0${fecha.getDate()}`;
    }
    else
    {
      if ((fecha.getMonth()+1)<10)
        this.fecha= fecha.getFullYear() + `0${fecha.getMonth()+1}` + `${fecha.getDate()}`;
      else
        this.fecha= fecha.getFullYear() + `0${fecha.getMonth()+1}` + `${fecha.getDate()}`;
    }

    return this.fecha;

//    window.alert('this.fecha='+ this.fecha);
  }
  
  fechaProximoDia(dia: number):string
  //dia es el Numero de Dia que eligio para jugar al futbol (0= Domingo al Sabado=6)
  {
    var d = new Date();
    var nrodiaActual:number= d.getDay();
    
//    window.alert('nrodiaActual='+ nrodiaActual);
//    window.alert('dia='+ dia);
    /****************************** Opcion 2 ************************/
    //dia= 4
    //nrodiaActual= 4
    /****************************** Opcion 1 ************************/
    //dia= 2 
    //nrodiaActual= 4
    /******************************/
    //dia= 0
    //nrodiaActual= 4
    /****************************** Opcion 1 ************************/
    //dia= 5
    //nrodiaActual= 4

    if (dia<nrodiaActual)
    {
      //Opcion 1
      this.fecha= this.sumarDias(d,7-(nrodiaActual-dia))
      
    }
    else
    {
        if (dia==nrodiaActual)
        {
          //Opcion 2
          this.fecha= this.sumarDias(d,7);
        }
        else
        {
          //Opcion 3
          this.fecha= this.sumarDias(d,dia-nrodiaActual);
        }
    }    
    return this.fecha;
  }
}
