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

  obtengoIdGrupo(ruta: string): string
  {
    this.grupo= ruta.split("/");
    /*return(parseInt(this.grupo[this.grupo.length-1]));*/

    return this.grupo[this.grupo.length-1];
  }

  agregarGrupo(grupo: any) : Promise<any>
  {
    return this.firestore.collection('grupos').add(grupo);
  }

  getGrupos():Observable<any>
  {
    return this.firestore.collection('grupos').get();
  }


  getGrupo(idrupo: string):Observable<any>
  {
    return this.firestore.collection('grupos').doc(idrupo).snapshotChanges();
    //.snapshotChanges(); 

  }    
}
