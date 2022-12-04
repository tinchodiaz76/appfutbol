import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jugadorHabitualModel } from '../models/habituales.model';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})

export class JueganService {

  juegan: jugadorHabitualModel[]=[];
  nombreSplit:any=[];
  nombre: string='';
  firebase: any;

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient
    ) { }

  agregarJugador(jugador: any) : Promise<any>
  {
    return this.firestore.collection('jugadores').add(jugador);
  }

  getJugadores() :Observable<any>
  {
    return this.firestore.collection('jugadores',ref=>ref.orderBy('fechaCreacion','asc')).snapshotChanges();
  }

  eliminarJugador(id:string) :Promise<any>
  {
    return this.firestore.collection('jugadores').doc(id).delete();
  }

  getJugador(id: string) :Observable<any>
  {
    return this.firestore.collection('jugadores').doc(id).snapshotChanges();
  }

  actualizarEmpleado(id: string, data:any) : Promise<any>
  {
    return this.firestore.collection('jugadores').doc(id).update(data);
  }

  casteaNombre(nombre:string) : string
  {
    this.nombreSplit=[];
    this.nombre='';

    this.nombreSplit= nombre.split(' ');

    this.nombreSplit.forEach((element:string) => {
      if (this.nombre==='')
      {
        this.nombre= element[0].toUpperCase() + element.toLowerCase().substring(1)
      }
      else
      {
        this.nombre= this.nombre +' '+ element[0].toUpperCase() + element.toLowerCase().substring(1)
      }
    });

    return this.nombre
  }
}


