import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
//Servicios
import { JueganService } from 'src/app/services/juegan.service';
import { JugadoresService } from 'src/app/services/jugadores.service';
import { GruposService } from 'src/app/services/grupos.service';

//Rutas
import { Router } from '@angular/router';

import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';


//Para la BD
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-listado-habituales',
  templateUrl: './listado-habituales.component.html',
  styleUrls: ['./listado-habituales.component.css']
})
export class ListadoHabitualesComponent implements OnInit {
   
  juegan :jugadorHabitualModel[]=[];//any[]=[];
  noJuegan :jugadorHabitualModel[]=[];//any[]=[];
  jugador: any;
  nroGrupo!: number;
  cantIntegrantes!: number;

  showDiv: boolean=false;
  
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
    
  constructor(private jueganService: JueganService,
              private jugadoresService: JugadoresService,
              private firestore: AngularFirestore,
              private router: Router,
              private gruposService: GruposService
              ) 
  {
  }

  ngOnInit(): void
  {
    
    this.nroGrupo= this.gruposService.obtengoNroGrupo(this.router.url)

//    window.alert('listado-habituales--->this.nroGrupo='+this.nroGrupo);

    this.getJugadoreByGroup(this.nroGrupo);

    this.gruposService.getGrupo(this.nroGrupo).subscribe((res:any)=>{
      res.forEach((element:any) => {
        /*Acceso al ID*/
//        console.log(element.payload.doc.id);
        /*Acceso a los OBJETOS*/
        console.log(element.payload.doc.data());

        if (element.payload.doc.data()){
          this.cantIntegrantes= element.payload.doc.data().cantIntegrantes;
        }
      })
    });
  }

/*
  getJugadores(nrogrupo: number)
*/
  getJugadoreByGroup(nroGrupo: number)
  {
    this.showDiv=true;

    this.jueganService.getJugadoresByGroup(nroGrupo).subscribe((res:any)=>{
      this.juegan=[];
      this.noJuegan=[];
      console.log('res=', res);
      res.forEach((element:any) => {
        /*Acceso al ID*/
//        console.log(element.payload.doc.id);
        /*Acceso a los OBJETOS*/
//        console.log(element.payload.doc.data());

        if (element.payload.doc.data().juega){
          this.juegan.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          })

//          console.log(this.juegan);
        }
        else
        {
          if (element.payload.doc.data().habitual)
          {
            this.noJuegan.push({
              id: element.payload.doc.id,
              ...element.payload.doc.data()
            })
          }
//          console.log(this.noJuegan);
        }
      });
//      console.log('this.juegan=', this.juegan);
//      console.log('this.noJuegan=', this.noJuegan);
      this.showDiv=false;
      this.jugadoresService.seteoJuegan(this.juegan);
      this.jugadoresService.seteoNoJuegan(this.noJuegan);
    })
  }

  actualizaJugador(estado: boolean, index:number){
    this.showDiv= true;

    //Si en el ESTADO=TRUE TOMO LA LISTA QUE NO THIS.NOJUEGAN
    //Si en el ESTADO=FALSE TOMO LA LISTA QUE NO THIS.JUEGAN
    if (estado)
    {      
      this.actualiza(this.noJuegan[index], estado);
    }
    else
    {
      this.actualiza(this.juegan[index], estado);
    }
  }

  actualiza(lista: any, estado: boolean)
  {
    if (!estado && !lista.habitual)
    {
      this.jueganService.eliminarJugador(lista.id).then(()=>{
//        console.log('Se elimino jugador');
      })
    }
    else
    {
      this.jugador={
//        id: lista.id,
        nombre: lista.nombre,
        juega: estado,
        activo: lista.activo,
        habitual: lista.habitual,
        fechaActualizacion: new Date()
      }

      /*
      //NO SE PUEDE OBTENER EL ID ASI....POR ESO CREO EL OBJETO JUGADOR.
      //      console.log(res.payload.data()['id']);
      */    

      this.jueganService.actualizarJugador(lista.id , this.jugador).then(()=>{
        //console.log('llamo a this.getJugadores');
        this.getJugadoreByGroup(this.nroGrupo);
        //this.getJugadores(this.nrogrupo);
        this.irArriba();
      }).catch(error=>{
      console.log(error);
      });
    }
  }

  irArriba()
  {
    window.scrollTo({

      top: 0,

      behavior: 'smooth' // for smoothly scrolling
    });
  }
}
