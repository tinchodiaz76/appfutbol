import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { jugadorHabitualModel } from '../models/habituales.model';
import { map } from 'rxjs/operators';
import { jueganModel } from '../models/juegan.model';


const URL= environment.urlServer;

@Injectable({
  providedIn: 'root'
})

export class JueganService {

  juegan: jugadorHabitualModel[]=[];

  constructor(private http: HttpClient) { }

  traerJugadores()
  {
    this.juegan=[];
    
    return this.http.get<jueganModel>(`${URL}/juegan.json`).pipe(
    map(res=>{
//      console.log('traerJugadores.res=', res);
      return this.armaArray(res);
            })
    )
  }

  armaArray(objeto: any)
  {
//    console.log('JueganService--->armaArray-->objeto')

    for (const registro in objeto)
    {

      if ( objeto[registro].juega)
      {
//        console.log('JueganService-->armaArray-->registro=', registro);
//        console.log('JueganService-->armaArray-->objeto[registro]=', objeto[registro]);

        this.juegan.push({id: registro,...objeto[registro]});
      }

    }

    return this.juegan;
  }

  actualizarJugador(habitual: jugadorHabitualModel)
  {

      let habitualTemp={
        ...habitual
      }
  
      delete habitualTemp.id;
  
      return this.http.put<jugadorHabitualModel>(`${URL}/juegan/${habitual.id}.json`, habitualTemp);
  }
}

