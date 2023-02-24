import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jugadorHabitualModel } from '../models/habituales.model';
import { Observable, Subscription} from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { JugadoresService } from './jugadores.service';

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
//    return this.firestore.collection('jugadores').doc(idGrupo).snapshotChanges();
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

  actualizarJugador(id: string, data:any) //: Promise<any>
  {
//    console.log('data.nombre=' + data.nombre);
//    console.log('data.juega=' + data.juega);

    //return this.firestore.collection('jugadores').doc(id).update(data);
    return this.firestore.collection('jugadores').doc(id).set(data);
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
                        idGrupo:element.payload.doc.data().idGrupo,
                        nombre: element.payload.doc.data().nombre,
                        juega: false,
                        habitual: element.payload.doc.data().habitual,
                        activo: element.payload.doc.data().activo,
                        fechaActualizacion: new Date()
                        //id: element.payload.doc.id,

                        //juega: false,
                        //fechaActualizacion: new Date()
                      }

              if (!element.payload.doc.data().habitual)
              {
                this.eliminarJugador(element.payload.doc.id).catch(error=>{
                  console.log(error);
                });
              }
              else
              {
/*                
                this.juegan.push({
                  id: element.payload.doc.id,
                  ...element.payload.doc.data()
                });
*/
                this.actualizarJugador(element.payload.doc.id , this.jugador).catch(error=>{
              
/*    
                this.actualizarJugador(element.payload.doc.id , this.juegan).catch(error=>{
*/                  
                  console.log(error);
                });
              }
          }
        });
        //this.jugadoresService.seteoJuegan([]);
        //this.jugadoresService.seteoNoJuegan(this.juegan);

        this.subscription?.unsubscribe();
    });
  }
}