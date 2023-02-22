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
import { Observable, windowCount } from 'rxjs';


@Component({
  selector: 'app-listado-habituales',
  templateUrl: './listado-habituales.component.html',
  styleUrls: ['./listado-habituales.component.css']
})
export class ListadoHabitualesComponent implements OnInit {
   
  juegan :jugadorHabitualModel[]=[];//any[]=[];
  noJuegan :jugadorHabitualModel[]=[];//any[]=[];
  jugador: any;
  idGrupo!: string;
  cantIntegrantes!: number;
  precio!: number;
  value!:string;
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
    
//    window.alert('this.router.url='+this.router.url);

    this.idGrupo= this.gruposService.obtengoIdGrupo(this.router.url)

    this.getJugadoreByGroup(this.idGrupo);


    this.gruposService.getGrupo(this.idGrupo).subscribe((res:any)=>{
//      console.log('res=', res.payload);
//      console.log('res=', res.payload.data());
      
      if (res.payload.data())
      {
        this.cantIntegrantes= res.payload.data().cantIntegrantes;
        this.precio= res.payload.data().precio;
      }
    });
  }

  getJugadoreByGroup(idGrupo: string)
  {
    this.showDiv=true;

    this.jueganService.getJugadoresByGroup(idGrupo).subscribe((res:any)=>{
      this.juegan=[];
      this.noJuegan=[];
//      console.log('getJugadoresByGroup--->res=', res);
      res.forEach((element:any) => {
        /*Acceso al ID*/
//       console.log('element.payload.doc.id=', element.payload.doc.id);
        /*Acceso a los OBJETOS*/
//       console.log(element.payload.doc.data());

        if (element.payload.doc.data().juega){
          this.juegan.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data()
          })

          this.value=(this.precio/this.juegan.length).toFixed(2);
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
//      console.log('this.noJuegan[index]=', this.noJuegan[index]);
      this.actualiza(this.noJuegan[index], estado);
      //Si la fechaProximoPartido de la coleccion grupos es menor a la fecha del dia. Cambio la fechaProximoPartido de la 
      //coleccion grupos.
    }
    else
    {
//      console.log('this.juegan[index]=', this.juegan[index]);
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
        juega: estado,
        fechaActualizacion: new Date()
      }

//      console.log('this.jugador='+ this.jugador);
      /*
      //NO SE PUEDE OBTENER EL ID ASI....POR ESO CREO EL OBJETO JUGADOR.
      //      console.log(res.payload.data()['id']);
      */    

      this.jueganService.actualizarJugador(lista.id , this.jugador).then(()=>{
        this.getJugadoreByGroup(this.idGrupo);
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
