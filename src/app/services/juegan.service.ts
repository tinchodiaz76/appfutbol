import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jugadorHabitualModel } from '../models/habituales.model';
import { Observable, Subscription} from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})

export class JueganService {

  juegan: jugadorHabitualModel[]=[];
  nombreSplit:any=[];
  nombre: string='';
  firebase: any;
  jugador: any;
  subscription: Subscription | undefined;

  constructor(
    private firestore: AngularFirestore
    ) { }

  getJugadoresByGroup(idGrupo: any):Observable<any>
  {
    return this.firestore.collection('jugadores', ref => ref.where('idGrupo', '==', idGrupo)).snapshotChanges();
    //return this.firestore.collection('jugadores', ref => ref.where('idGrupo', '==', idGrupo)).get();
      
    
  }


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

  actualizarJugador(id: string, data:any) : Promise<any>
  {
//    console.log('data.nombre=' + data.nombre);
//    console.log('data.juega=' + data.juega);

    return this.firestore.collection('jugadores').doc(id).update(data);
  }

  castea(nombre:string) : string
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

  falseJuega(idGrupo: string)
  {
    //Paso el campo juega a false, si el jugador no fue modificado 
    this.subscription = this.getJugadoresByGroup(idGrupo).subscribe((res:any)=>{
//      console.log('getJugadoresByGroup--->res=', res);
        res.forEach((element:any) => {
          if (element.payload.doc.data().juega)
          {
              this.jugador={
                        juega: false,
                        fechaActualizacion: new Date()
                      }

              if (!element.payload.doc.data().habitual)
              {
                this.eliminarJugador(element.payload.doc.id).catch(error=>{
                  console.log(error);
                });
              }
              else
              {
                this.actualizarJugador(element.payload.doc.id , this.jugador).catch(error=>{
                  console.log(error);
                });
              }
          }
        });

        this.subscription?.unsubscribe();
    });
  }
}