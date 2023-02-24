import { Component, OnInit } from '@angular/core';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
import { grupoModel } from 'src/app/models/grupo.model';
import { UtilidadesService } from 'src/app/services/utilidades.service';

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
//Para la libreria momnet.js
import * as moment from 'moment';


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
  grupo!: grupoModel;
    
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor(private jueganService: JueganService,
              private jugadoresService: JugadoresService,
              private firestore: AngularFirestore,
              private router: Router,
              private gruposService: GruposService,
              private utilidades: UtilidadesService,
              private grupoService: GruposService
              ) 
  {
  }

  ngOnInit()
  {

    this.idGrupo= this.gruposService.obtengoIdGrupo(this.router.url)

//    this.getJugadoreByGroup(this.idGrupo);


    this.gruposService.getGrupo(this.idGrupo).subscribe(async (res:any)=>{
//      console.log('res=', res.payload);
//      console.log('res=', res.payload.data());
      
      if (res.payload.data())
      {
        this.cantIntegrantes= res.payload.data().cantIntegrantes;
        this.precio= res.payload.data().precio;
     
        if (moment(res.payload.data().fechaProximoPartido).isBefore(moment().format('L')))
        {
          this.jueganService.falseJuega(res.payload.id);

          //Debo cambiar la fechaProximoPartido, en la coleccion GRUPOS.
          this.grupo={
          nombre:res.payload.data().nombre,
          cantIntegrantes: res.payload.data().cantIntegrantes,
          dia: res.payload.data().dia,
          direccion: res.payload.data().direccion,
          hora: res.payload.data().hora,
          precio: res.payload.data().precio,
          fechaProximoPartido: this.utilidades.buscar(parseInt(res.payload.data().dia)),
          juegaTorneo: res.payload.data().juegaTorneo,
          mail: res.payload.data().mail
          };

          this.idGrupo= res.payload.id;

          this.grupoService.actualizarGrupo(this.idGrupo, this.grupo).then(()=>{
//                console.log('llamo a getJugadoreByGroup-con Modificacion de GRUPO');
          }).catch(error=>{
            console.log(error);
          });          
        }
        else
        {
//            console.log('llamo a getJugadoreByGroup ONINIT');
          this.getJugadoreByGroup(this.idGrupo);
        }
      }
    });
  }

  getJugadoreByGroup(idGrupo: string)
  {
//    console.log('Entro en getJugadoreByGroup');

    this.jueganService.getJugadoresByGroup(idGrupo).subscribe((res:any)=>{
      this.juegan=[];
      this.noJuegan=[];
//      console.log('getJugadoresByGroup--->res=', res);
      res.forEach((element:any) => {
        //Acceso al ID
//       console.log('element.payload.doc.id=', element.payload.doc.id);
        //Acceso a los OBJETOS
//        console.log('element.payload.doc.data()='+element.payload.doc.data().nombre);
//        console.log('element.payload.doc.data()='+element.payload.doc.data().juega);

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

//    console.log('Entro en actualizaJugador');
    //Si en el ESTADO=TRUE TOMO LA LISTA QUE NO THIS.NOJUEGAN
    //Si en el ESTADO=FALSE TOMO LA LISTA QUE NO THIS.JUEGAN
    if (estado)
    {      
      this.actualiza(this.noJuegan[index], estado);
    }
    else
    {
      this.actualiza(this.juegan[index], estado)
    }
  }

  actualiza(lista: any, estado: boolean)
  {
          if (!estado && !lista.habitual)
          {

            this.jueganService.eliminarJugador(lista.id).catch(error=>{
              console.log(error);
            });
          }
          else
          {

//            console.log('1111111');
//            console.log('lista.id='+ lista.id);
//            console.log('lista.idGrupo='+ lista.idGrupo);
//            console.log('lista.activo='+ lista.activo);
//            console.log('estado='+ estado);

            const data = {
              idGrupo:lista.idGrupo,
              nombre: lista.nombre,
              juega: estado,
              habitual: lista.habitual,
              activo: lista.activo,
              fechaActualizacion: new Date()
            };
 
            this.jueganService.actualizarJugador(lista.id , data).catch(error=>{
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
