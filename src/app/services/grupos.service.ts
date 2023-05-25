import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  grupo : any;

  constructor( private firestore: AngularFirestore
  ) { }

  getIdGrupo(ruta: string): string
  {
    this.grupo= ruta.split("/");
    /*return(parseInt(this.grupo[this.grupo.length-1]));*/

    return this.grupo[this.grupo.length-1];
  }

  addGrupo(grupo: any) : Promise<any>
  {
    return this.firestore.collection('grupos').add(grupo);
  }
  
  getGrupoPorCreador(email: string):Observable<any>
  {
    return this.firestore.collection('grupos', ref => ref.where('emailCreador', '==', email)).snapshotChanges();
  }

  getGrupo(idGrupo: string):Observable<any>
  {
    return this.firestore.collection('grupos').doc(idGrupo).snapshotChanges();
  }


  setGrupo(id: string, data:any) //: Promise<any>
  {
    //return this.firestore.collection('grupos').doc(id).update(data);
    //return this.firestore.collection('jugadores', ref => ref.where('idGrupo', '==', idGrupo)).snapshotChanges();
    return this.firestore.collection('grupos').doc(id).set(data)
  }

  //setLlave(llave :string, valor: any){
  setLlave(valor :any)
  {
    let v_obj: any={};
    
    v_obj= this.getValorLlave('parametros');
    
    console.log(v_obj);

    if ( Object.keys(v_obj).length === 0)
    {
      localStorage.setItem('parametros',JSON.stringify(valor));
    }
    else
    {
//      console.log(v_obj);
      
      v_obj= JSON.stringify(v_obj); 
//      console.log(v_obj)
      
      v_obj = v_obj.substring(0, v_obj.length - 1);
//      console.log(v_obj)

      v_obj=v_obj + ',' + JSON.stringify(valor).slice(1, -1) +'}';
//      console.log(v_obj)

      v_obj= JSON.parse (v_obj)
//      console.log(v_obj)
      
      localStorage.setItem('parametros',JSON.stringify(v_obj));
      
    }
  }

  removeLlave(llave :string){
    localStorage.removeItem(llave);
  }

  getValorLlave(llave :string)
  {
    let codigoGrupo= JSON.parse(localStorage.getItem(llave) || '{}');
    return (codigoGrupo);
  }
}