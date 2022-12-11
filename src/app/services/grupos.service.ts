import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { grupoModel } from '../models/grupo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  grupo : any;

  constructor( private firestore: AngularFirestore
  ) { }

  obtengoNroGrupo(ruta: string): number
  {
    this.grupo= ruta.split("/");

    return(parseInt(this.grupo[this.grupo.length-1]));
  }

  agregarGrupo(grupo: any) : Promise<any>
  {
    return this.firestore.collection('grupos').add(grupo);
  }

  getGrupos():Observable<any>
  {
    return this.firestore.collection('grupos').get();
  }

  getGrupo(nroGrupo: any):Observable<any>
  {
    return this.firestore.collection('grupos', ref => ref.where('idGrupo', '==', parseInt(nroGrupo))).snapshotChanges()
      
    //return this.firestore.collection('grupos', ref => ref.where('idGrupo', '==', parseInt(nroGrupo))).get();
  }    
}
