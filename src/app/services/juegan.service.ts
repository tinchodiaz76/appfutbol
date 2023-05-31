import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jugadorHabitualModel } from '../models/habituales.model';
import { Observable} from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UtilidadesService } from './utilidades.service';

@Injectable({
  providedIn: 'root'
})

export class JueganService {

  juegan: jugadorHabitualModel[]=[];
  nombreSplit:any=[];
  nombre: string='';
  firebase: any;
  jugador: any;
  
  constructor(
    private firestore: AngularFirestore,
    private utilidadesService: UtilidadesService
    ) { }

  getUserById(id: string):Observable<any>
  {
    return this.firestore.collection('users').doc(id).snapshotChanges();
  }

  setJugadorbyId(id: string, data:any) //: Promise<any>
  {
    return this.firestore.collection('users').doc(id).set(data);
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

    //Me trae los grupos a los cuales pertenece un jugador
  getGruposbyJugador(idUser: string):Observable<any>
    {
      return this.firestore.collection('jugadorbygrupos', ref => ref.where('idUser', '==', idUser)).snapshotChanges();
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
      console.log('falseJuega-Inicio');
      let subscription = this.getJugadoresByGrupo(idGrupo).subscribe((res:any)=>{

        if (res.length>0)
        {
          res.forEach((catData: any) => {
//            console.log('getJugadoresByGroup--->res.id=', catData.payload.doc.id);
//            console.log('getJugadoresByGroup--->res.alias=', catData.payload.doc.data().alias);
//            console.log('getJugadoresByGroup--->res.juega=', catData.payload.doc.data().juega);

            if (catData.payload.doc.data().juega)
            {
              this.jugador={
                            idGrupo:catData.payload.doc.data().idGrupo,
                            idUser:catData.payload.doc.data().idUser,
                            alias: catData.payload.doc.data().alias,
                            juega: false,
                            habitual: catData.payload.doc.data().habitual,
                            activo: catData.payload.doc.data().activo
                      };

              this.setJugadorbyGrupo(catData.payload.doc.id,this.jugador).then(()=>{
                  this.utilidadesService.refreshRoute(idGrupo);                 
                },(error)=>{
                  console.log(error);
                });
            }
          });
        }
        subscription.unsubscribe();
      });
      console.log('falseJuega-Fin');
    }
}