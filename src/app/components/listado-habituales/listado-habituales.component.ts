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
import { AlertasService } from 'src/app/services/alertas.service';

import { Time } from '@angular/common';
//Iconos
import { faCopy, faRightFromBracket, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons'

//Dialog
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogoJugadorComponent } from '../dialogo-jugador/dialogo-jugador.component';

export interface DialogData {
  cantJugadores: number,
  nombre: string,
  check: boolean
}

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
  value!:string;
  showDiv: boolean=false;
  grupo!: grupoModel;
    
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  direccion!:string;
  hora!:Time;
  nombreDia!: string;
  title!:string;
  dia!:number;
  precio!:number;

  infoGrupo:boolean=false;
  infoJugadores: boolean=false;
  cargando:boolean=true;

  fecha: string='';
  fecha_Bck: string='';
  linkGrupo!: string;

  faCopy= faCopy;
  faRightFromBracket= faRightFromBracket;
  faPlus=faPlus;
  faWhatsapp= faWhatsapp;
  cambioEstadoJugadores: boolean=false;
  
  constructor(private jueganService: JueganService,
              private jugadoresService: JugadoresService,
              private firestore: AngularFirestore,
              private router: Router,
              private gruposService: GruposService,
              private utilidades: UtilidadesService,
              private grupoService: GruposService,
              private alertasService:AlertasService,
              public dialog: MatDialog,
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
        
        if (moment(res.payload.data().fechaProximoPartido).isBefore(moment().format('L')))
        {
          this.cambioEstadoJugadores=true;
//          window.alert('this.cambioEstadoJugadores-1='+this.cambioEstadoJugadores);

          this.jueganService.falseJuega(res.payload.id)

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
            this.getJugadoreByGroup(this.idGrupo);
            this.cambioEstadoJugadores=false;
          }).catch(error=>{
            console.log(error);
          });          
        }
        else
        {
          //this.cambioEstadoJugadores=false;
//          window.alert('this.cambioEstadoJugadores-2='+this.cambioEstadoJugadores);
//            console.log('llamo a getJugadoreByGroup ONINIT');
          this.getJugadoreByGroup(this.idGrupo);
        }

        this.cantIntegrantes= res.payload.data().cantIntegrantes;
        this.precio= res.payload.data().precio;

        this.title= res.payload.data().nombre;
        this.cantIntegrantes= res.payload.data().cantIntegrantes;
        this.dia= res.payload.data().dia;
        this.precio= res.payload.data().precio;
        this.direccion= res.payload.data().direccion;
        this.hora= res.payload.data().hora;
    
        switch (this.dia) {
          case 1:
              this.nombreDia='Lunes';
              break;
          case 2:
              this.nombreDia='Martes';
              break;
          case 3:
              this.nombreDia='Miercoles';
              break;
          case 4:
              this.nombreDia='Jueves';
              break;
          case 5:
              this.nombreDia='Viernes';
              break;
          case 6:
              this.nombreDia='Sabado';
              break;
          default:
              //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
              this.nombreDia='Domingo';
              break;            
        }
    
        this.linkGrupo=res.payload.id;

//        this.fecha= this.utilidades.fechaProximoDia(this.dia);
        this.fecha_Bck= this.utilidades.buscar(this.dia);

//        window.alert(this.fecha_Bck.substring(3,5) + '/' + this.fecha_Bck.substring(0,2) + '/' + this.fecha_Bck.substring(6,10));
        
        this.fecha= this.fecha_Bck.substring(3,5) + '/' + this.fecha_Bck.substring(0,2) + '/' + this.fecha_Bck.substring(6,10);
      }
      else
      {
        this.alertasService.mostratSwettAlert('', 'El grupo no existe','error');
        this.router.navigate(['/']);
      }
    });
  }

  getJugadoreByGroup(idGrupo: string)
  {
      this.jueganService.getJugadoresByGroup(idGrupo).subscribe((catsSnapshot) => {
        this.juegan=[]
        this.noJuegan=[];
        catsSnapshot.forEach((catData: any) => {
          //console.log(catData.payload.doc.data());
          if (catData.payload.doc.data().juega===true)
          {
            this.juegan.push({
              /*
              id: catData.payload.doc.id,
              data: catData.payload.doc.data()
              */
              id: catData.payload.doc.id,
              ...catData.payload.doc.data()
            });
            this.value=(this.precio/this.juegan.length).toFixed(2);
          }
          else
          {
            if (catData.payload.doc.data().habitual)
            {
              this.noJuegan.push({
                id: catData.payload.doc.id,
                ...catData.payload.doc.data()
              })
            }
            this.value=(this.precio/this.juegan.length).toFixed(2);
          }
        });

//        console.log('this.juegan=', this.juegan);
//        console.log('this.noJuegan=', this.noJuegan);

        this.infoJugadores= true;
        this.infoGrupo=true;
        this.cargando=false;

        this.showDiv=false;
        this.jugadoresService.seteoJuegan(this.juegan);
        this.jugadoresService.seteoNoJuegan(this.noJuegan);

        if (this.juegan.length==10 && !this.cambioEstadoJugadores)
        {
          this.alertasService.mostratSwettAlert('', '¡Ya somos 10!','success');
        }

//////////////////        this.irArriba();
      });
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
            const data = {
              idGrupo:lista.idGrupo,
              nombre: lista.nombre,
              juega: estado,
              habitual: lista.habitual,
              activo: lista.activo,
              fechaActualizacion: new Date()
            };
 
            this.jueganService.actualizarJugador(lista.id , data).then(()=>{
              console.log('Documento editado exitósamente');
            }, (error) => {
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

  insertaJugador(idGrupo: string, nombre:string, juega: boolean, activo: boolean, habitual: boolean, 
    title: string, mensaje: string, icono: string
    )
  {
      this.jugador={
      idGrupo,
      nombre, 
      juega, 
      activo,
      habitual,
      fechaCreacion: new Date()//,
      //fechaActualizacion: new Date()
      };

      //    console.log('jugador=', this.jugador);

      this.jueganService.agregarJugador(this.jugador).then(()=>{
      //      console.log('Jugador Agregado con Exito');
      this.alertasService.mostratSwettAlert(title, mensaje, icono);
      this.showDiv= false;
      }).catch(error=>{
      console.log(error);
      });
  }


  abrirDialogo(): void 
  {
    const dialogo1= this.dialog.open(DialogoJugadorComponent, {
      data: {cantJugadores: 0, nombre: '', check: false},
    });

    dialogo1.afterClosed().subscribe(art => {

//          window.alert('dialogo1.afterClosed().nroGrupo='+ this.nroGrupo);

          if (art.nombre!='' || art=='undefined')
          //Controlo que haya ingresado un nomnbre
          {

              this.showDiv= true;

              const namesJuegan = this.juegan.map(el => el.nombre);

              const namesNoJuegan = this.noJuegan.map(el => el.nombre);
        
              if ((namesJuegan.includes(this.jueganService.castea(art.nombre))) || (namesNoJuegan.includes(this.jueganService.castea(art.nombre))))
              //Controlo que el nombre ingresado no este ni en listaJuegan, ni en listaNoJuegan
              {
                  this.showDiv= true;  
                  this.alertasService.mostratSwettAlert('¡Ya existe un Jugador con ese nombre!', '', 'error');
              }
              else
              {
                  if (this.juegan.length<this.cantIntegrantes)

                  //Son menos de 10 jugadores para el proximo Sabado
                  {
                    if (!art.check)
                    //No quiere ser habitual, se suma para jugar este Sabado
                    {
                      this.insertaJugador(this.idGrupo, this.jueganService.castea(art.nombre), true,true,art.check,
                        '¡Nos vemos el Sábado!','', 'success' );
                    }  
                    else
                    //Lo sumamos como habitual.
                    {
                      this.insertaJugador(this.idGrupo, this.jueganService.castea(art.nombre), false, true,art.check,
                          '¡Te sumaste a los de siempre!','', 'success' );
                      }
                  }
                  else
                  {
                    //Ya son 10 jugadores para el proximo Sabado
                    if (!art.check)
                      //No quiere ser habitual, es decir quiere juegar el Sabado, no lo dejo!!!
                    {  
                      this.showDiv=false;
                      this.alertasService.mostratSwettAlert('¡El cupo esta completo!', '', 'error');
                    }
                    else
                    {
                      //quiere ser habitual, pero le avisamo que lo esperamos la proxima
                      this.insertaJugador(this.idGrupo, this.jueganService.castea(art.nombre), false, true,art.check,
                          '¡Te agregaste a los de siempre! <br> Te esperamos la próxima.','', 'info' );
                    }
                  }
              }
          }
          else
          {
              this.alertasService.mostratSwettAlert('¡Debe ingresar un nombre!','','error');
          }
    });
  }

  compartirWhatsapp() {

    //window.open("https://web.whatsapp.com/send?text=quienJuega-El codigo del grupo es: "+ this.linkGrupo);
    window.open("https://api.whatsapp.com/send?text=Ingresá aquí www.quienjuega.com.ar/grupo/"+ this.linkGrupo + " para sumarte");
    //this.clipboardApi.copyFromContent(this.linkGrupo);
    //this.alertasService.mostratSwettAlertToast('Link copiado','success');
  }

  back(){
    this.router.navigate(['/']);
  }
}
