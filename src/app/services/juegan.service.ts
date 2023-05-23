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

  //Obtiene todos los jugadores
  getJugadores() {
    return this.firestore.collection('jugadores').snapshotChanges();
  }

  getjugadorById(id: string):Observable<any>
  {
    return this.firestore.collection('users').doc(id).snapshotChanges();
  }

  //Se fija en jugadrobygrupos si tiene un grupo asocioado
  getGruposPorJugador(idUser: string)
  {
    return this.firestore.collection('jugadorbygrupos', ref => (ref.where('idUser', '==', idUser))).snapshotChanges();
  }

  //Se fija si esta creado el usuario en USERS
 getJugadorByMail(email: string):Observable<any>
  {
    return this.firestore.collection('users', ref => (ref.where('email', '==', email))).snapshotChanges();
  }

  //Trae los datos de jugadorbygrupos
  getJugadorbyGrupo(idGrupo: string)
  {
    //return this.firestore.collection('jugadorbygrupos', ref=> ref.where('idGrupo', '==', idGrupo).where('idUser', '==', idUser)).snapshotChanges();
    return this.firestore.collection('jugadorbygrupos', ref=> ref.where('idGrupo', '==', idGrupo)).snapshotChanges();
  }

  //Trae los datos de jugadorbygrupos
  getJugadorbyAlias(idGrupo: string, alias:string)
  {
    return this.firestore.collection('jugadorbygrupos', ref=> ref.where('idGrupo', '==', idGrupo).where('alias', '==', alias)).snapshotChanges();
  }  
  
  setJugadorbyGrupo(id: string, data:any) //: Promise<any>
  {
    return this.firestore.collection('jugadorbygrupos').doc(id).set(data);
  }

  addJugadorbyGrupo(jugador: any) : Promise<any>
  {
    return this.firestore.collection('jugadorbygrupos').add(jugador);
  }

  getJugadoresByGrupo(idGrupo: string)
  {
    return this.firestore.collection('jugadorbygrupos', ref => (ref.where('idGrupo', '==', idGrupo))).snapshotChanges();
  }




  //Me trae los jugadores de un grupo determinado
  getJugadoresByGroup(idGrupo: any):Observable<any>
  {
    return this.firestore.collection('jugadores', ref => ref.where('idGrupo', '==', idGrupo)).snapshotChanges();
//    return this.firestore.collection('jugadores').doc(idGrupo).snapshotChanges();
  }

  //Me trae los grupos a los cuales pertenece un jugador
  getGruposbyJugador(idUser: string):Observable<any>
  {
    return this.firestore.collection('jugadorbygrupos', ref => ref.where('idUser', '==', idUser)).snapshotChanges();
  }

  getJugadorByGroup(idGrupo: any):Observable<any>
  {
    return this.firestore.collection('jugadores', ref => ref.where('idGrupo', '==', idGrupo)).snapshotChanges();
//    return this.firestore.collection('jugadores').doc(idGrupo).snapshotChanges();
  }

  agregarJugador(jugador: any) : Promise<any>
  {
    return this.firestore.collection('jugadores').add(jugador);
  }

  eliminarJugador(id:string) //:Promise<any>
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
    //let mensaje = new Promise((resolve, reject) => {  
      console.log('falseJuega-Inicio');
      this.subscription = this.getJugadoresByGroup(idGrupo).subscribe((res:any)=>{
//      console.log('getJugadoresByGroup--->res=', res);
        res.forEach((element:any) => {
          if (element.payload.doc.data().juega)
          {

            if (!element.payload.doc.data().habitual)
            {
              this.eliminarJugador(element.payload.doc.id).then(()=>{
                console.log('Documento eliminado exitósamente');
              }, (error) => {
                console.log(error);
              });
            }
            else
            {
              this.jugador={
                        idGrupo:element.payload.doc.data().idGrupo,
                        nombre: element.payload.doc.data().nombre,
                        juega: false,
                        habitual: element.payload.doc.data().habitual,
                        activo: element.payload.doc.data().activo,
                        fechaActualizacion: new Date()
                      }

              this.actualizarJugador(element.payload.doc.id , this.jugador).then(()=>{
                  console.log('Documento actualizado exitósamente-1');
                },(error)=>{
                  console.log(error);
                });
            }
          }
        }); //forEach
        this.subscription?.unsubscribe();
      });
      console.log('falseJuega-Fin');
      //resolve('1'); 
    //});
  }
}