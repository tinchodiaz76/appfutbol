import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { jugadorHabitualModel } from '../models/habituales.model';
import { map } from 'rxjs/operators';

const URL= environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class HabitualService {

  jugadoresHabituales: jugadorHabitualModel[]=[];

  constructor(private http: HttpClient) { }

  crearJugadorHabitual(habitual: jugadorHabitualModel)
  {

//  MAP lo que hace es que una vez que el observable tenga la respuesta,
//    transforma la info recibida y envia de nuevo la info con el datos transformado
    
    return this.http.post(`${URL}/juegan.json`, habitual).pipe(
      map((res:any)=>{
        habitual.id= res.name; //En el res.name viene el ID
        return habitual;
      })
    )
  }

  actualizarJugadorHabitual(habitual: jugadorHabitualModel)
  {

    let habitualTemp={
      ...habitual
    }

    delete habitualTemp.id;

    return this.http.put<jugadorHabitualModel>(`${URL}/juegan/${habitual.id}.json`, habitualTemp);
  }

  traerJugadorHabitual() :any{
    
    this.jugadoresHabituales=[];
    //Firebase me devuleve objetos, no arreglos, por eso invoco a armaArray
    return this.http.get<jugadorHabitualModel>(`${URL}/juegan.json`).pipe(
      map((res:any)=>{
//        console.log('traerJugadorHabitual.res=', res);
        return this.armaArray(res);
      })
    );
  }

  armaArray(objeto: any)
  {
//    console.log('HabitualService--->armaArray-->objeto')
    
      for (const registro in objeto)
      {
//        console.log('HabitualService-->armaArray-->this.pepe=', registro);
//        console.log('HabitualService-->armaArray-->this.pepe=', objeto[registro]);
/*
        if ((!objeto[registro].juega) && (objeto[registro].habitual))
*/        
      if (objeto[registro].habitual)
        this.jugadoresHabituales.push({id: registro,... objeto[registro]})
//        console.log('this.jugadoresHabituales=',this.jugadoresHabituales);
      }
      
//      console.log('armaArray-->this.jugadoresHabituales=', this.jugadoresHabituales);
      
      return this.jugadoresHabituales;
  }

}
