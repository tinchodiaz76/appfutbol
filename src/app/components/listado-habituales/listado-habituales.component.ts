import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
import { JueganService } from 'src/app/services/juegan.service';
import { AlertasService } from 'src/app/services/alertas.service';

import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { JugadoresService } from 'src/app/services/jugadores.service';

//Para la BD
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-listado-habituales',
  templateUrl: './listado-habituales.component.html',
  styleUrls: ['./listado-habituales.component.css']
})
export class ListadoHabitualesComponent implements OnInit {
   
  listaJuegan: Observable<any>

  juegan :jugadorHabitualModel[]=[];//any[]=[];
  noJuegan :jugadorHabitualModel[]=[];//any[]=[];
  jugador: any;

  
  fecha: string='';
  showDiv: boolean=false;
  
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
    
  constructor(private jueganService: JueganService,
              private alertasService: AlertasService,
              private jugadoresService: JugadoresService,
              private firestore: AngularFirestore
              ) 
  {
    this.listaJuegan = firestore.collection('jugadores').valueChanges();
  }

  ngOnInit(): void {
    this.fechaProximoSabado();
    this.getJugadores();
  }

  sumarDias(fecha: Date, dias: number){
    fecha.setDate(fecha.getDate() + dias);
//    console.log(fecha.getMonth()+1);
    this.fecha= fecha.getDate() + '/' +  `${fecha.getMonth()+1}` + '/' + fecha.getFullYear();
  }
  
  fechaProximoSabado()
  {
    var d = new Date();
    var nrodia:number= d.getDay();
    this.sumarDias(d, 6-nrodia);
  }

  getJugadores()
  {
    this.showDiv=true;

    this.jueganService.getJugadores().subscribe((res:any)=>{

      this.juegan=[];
      this.noJuegan=[];


//      console.log('res=', res);
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
        id: lista.id,
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

      this.jueganService.actualizarEmpleado(this.jugador.id , this.jugador).then(()=>{
        //console.log('llamo a this.getJugadores');
        this.getJugadores();
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
