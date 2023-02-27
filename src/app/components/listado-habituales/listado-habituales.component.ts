import { Component, OnInit, OnDestroy } from '@angular/core';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
import { grupoModel } from 'src/app/models/grupo.model';
import { UtilidadesService } from 'src/app/services/utilidades.service';

//Servicios
import { JueganService } from 'src/app/services/juegan.service';
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
import { Subscription } from 'rxjs';

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
export class ListadoHabitualesComponent implements OnInit  {
   
  public juegan :jugadorHabitualModel[]=[];//any[]=[];
  public noJuegan :jugadorHabitualModel[]=[];//any[]=[];
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
  fecha_Bck!: string;
  linkGrupo!: string;

  faCopy= faCopy;
  faRightFromBracket= faRightFromBracket;
  faPlus=faPlus;
  faWhatsapp= faWhatsapp;
  
  //subscription: Subscription | undefined;
  subscriptionGrupo: Subscription | undefined;
  subscription: Subscription | undefined;

  constructor(private jueganService: JueganService,
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
//    this.juegan=[];
//    this.noJuegan=[];
    //tomo el idGrupo que viene en la URL
    this.idGrupo= this.gruposService.obtengoIdGrupo(this.router.url)

    //Me fijo si el Grupo Existe
    this.grupoService.getGrupo(this.idGrupo).subscribe((grupoSnapshot:any)=>{

      if (grupoSnapshot.payload.data()==undefined)
      {
//          editGrupoSubscribe.unsubscribe();
          this.alertasService.mostratSwettAlert('','El codigo no existe', 'error');
      }
      else
      {
          this.cantIntegrantes= grupoSnapshot.payload.data().cantIntegrantes;
          this.precio= grupoSnapshot.payload.data().precio;

          this.title= grupoSnapshot.payload.data().nombre;
          this.cantIntegrantes= grupoSnapshot.payload.data().cantIntegrantes;
          this.dia= grupoSnapshot.payload.data().dia;
          this.precio= grupoSnapshot.payload.data().precio;
          this.direccion= grupoSnapshot.payload.data().direccion;
          this.hora= grupoSnapshot.payload.data().hora;
      
          this.linkGrupo=grupoSnapshot.payload.id;
          this.fecha_Bck= this.utilidades.buscar(this.dia);
          this.fecha= this.fecha_Bck.substring(3,5) + '/' + this.fecha_Bck.substring(0,2) + '/' + this.fecha_Bck.substring(6,10);

          switch (this.dia) 
          {
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
          };


          if (moment(grupoSnapshot.payload.data().fechaProximoPartido).isBefore(moment().format('L')))
          {
//            window.alert('222222');
            this.jueganService.falseJuega(grupoSnapshot.payload.id);
            //Debo cambiar la fechaProximoPartido, en la coleccion GRUPOS.
            this.grupo={
                nombre:grupoSnapshot.payload.data().nombre,
                cantIntegrantes: grupoSnapshot.payload.data().cantIntegrantes,
                dia: grupoSnapshot.payload.data().dia,
                direccion: grupoSnapshot.payload.data().direccion,
                hora: grupoSnapshot.payload.data().hora,
                precio: grupoSnapshot.payload.data().precio,
                fechaProximoPartido: this.utilidades.buscar(parseInt(grupoSnapshot.payload.data().dia)),
                juegaTorneo: grupoSnapshot.payload.data().juegaTorneo,
                mail: grupoSnapshot.payload.data().mail
            };

            this.grupoService.actualizarGrupo(this.idGrupo, this.grupo).then(()=>{
              console.log('Se actualizo el GRUPO exitosamente');
            }).catch(error=>{
              console.log(error);
            }); 
          }
          else
          {
//            window.alert('333333');
            this.jueganService.getJugadoresByGroup(this.idGrupo).subscribe((jugadoresSnapshot) => {
              this.juegan=[];
              this.noJuegan=[];
              jugadoresSnapshot.forEach((catData: any) => {
                //Si pertenece al grupo
//                  console.log(catData.payload.doc.data());
                  //Si juega
                  if (catData.payload.doc.data().juega)
                  {
                    this.juegan.push({
                      id: catData.payload.doc.id,
                      idGrupo: catData.payload.doc.data().idGrupo,
                      nombre: catData.payload.doc.data().nombre,
                      juega: catData.payload.doc.data().juega,
                      habitual: catData.payload.doc.data().habitual,
                      activo: catData.payload.doc.data().activo,
                      fechaActualizacion: catData.payload.doc.data().fechaActualizacion
                    });
                  }
                  else
                  {
                    this.noJuegan.push({
                      id: catData.payload.doc.id,
                      idGrupo: catData.payload.doc.data().idGrupo,
                      nombre: catData.payload.doc.data().nombre,
                      juega: catData.payload.doc.data().juega,
                      habitual: catData.payload.doc.data().habitual,
                      activo: catData.payload.doc.data().activo,
                      fechaActualizacion: catData.payload.doc.data().fechaActualizacion
                    });
                  }
              });//Finalo el forEach

              this.value=(this.precio/this.juegan.length).toFixed(2);

              this.infoJugadores= true;
              this.infoGrupo=true;
              this.cargando=false;
      
              this.showDiv=false;
//              console.log('this.juegan='+ this.juegan.length);

/*            
              this.jueganService.getJugadores().subscribe((jugadoresSnapshot) => {
              this.juegan=[];
              this.noJuegan=[];

              jugadoresSnapshot.forEach((catData: any) => {
                //Si pertenece al grupo
                if (catData.payload.doc.data().idGrupo== this.idGrupo)
                {
//                  console.log(catData.payload.doc.data());
                  //Si juega
                  if (catData.payload.doc.data().juega)
                  {
                    this.juegan.push({
                      id: catData.payload.doc.id,
                      idGrupo: catData.payload.doc.data().idGrupo,
                      nombre: catData.payload.doc.data().nombre,
                      juega: catData.payload.doc.data().juega,
                      habitual: catData.payload.doc.data().habitual,
                      activo: catData.payload.doc.data().activo,
                      fechaActualizacion: catData.payload.doc.data().fechaActualizacion
                    });
                  }
                  else
                  {
                    this.noJuegan.push({
                      id: catData.payload.doc.id,
                      idGrupo: catData.payload.doc.data().idGrupo,
                      nombre: catData.payload.doc.data().nombre,
                      juega: catData.payload.doc.data().juega,
                      habitual: catData.payload.doc.data().habitual,
                      activo: catData.payload.doc.data().activo,
                      fechaActualizacion: catData.payload.doc.data().fechaActualizacion
                    });
                  }
                }
              });//Finalo el forEach

              this.value=(this.precio/this.juegan.length).toFixed(2);

              this.infoJugadores= true;
              this.infoGrupo=true;
              this.cargando=false;
      
              this.showDiv=false;
//              console.log('this.juegan='+ this.juegan.length);
*/
            });
          }
      }
  })
}


  actualizaJugador(estado: boolean, index:number){
    this.showDiv= true;
    //Si en el ESTADO=TRUE TOMO LA LISTA QUE NO THIS.NOJUEGAN
    //Si en el ESTADO=FALSE TOMO LA LISTA QUE NO THIS.JUEGAN
    if (estado)
    { 
//      this.actualiza(this.noJuegan[index], estado);

      const data = {
        idGrupo:this.noJuegan[index].idGrupo,
        nombre: this.noJuegan[index].nombre,
        juega: true,
        habitual: this.noJuegan[index].habitual,
        activo: this.noJuegan[index].activo,
        fechaActualizacion: new Date()
      };

      this.jueganService.actualizarJugador(this.noJuegan[index].id, data).then(()=>{
        this.showDiv=false;
        console.log('Documento editado exitósamente');

        if (this.juegan.length===10)
        {
            this.alertasService.mostratSwettAlert('', '¡Ya somos 10!','success');
        }
      }, (error) => {
        console.log(error);
      });
    }
    else
    {
      //En el estado viene FALSE, si es habitual cambia solo el estado a FALSE. Si no es habitual, elimino el 
      //el jugador.
      if (this.juegan[index].habitual)
      {
        const data = {
          idGrupo:this.juegan[index].idGrupo,
          nombre: this.juegan[index].nombre,
          juega: false,
          habitual: this.juegan[index].habitual,
          activo: this.juegan[index].activo,
          fechaActualizacion: new Date()
        };
      
        this.jueganService.actualizarJugador(this.juegan[index].id, data).then(()=>{
          this.showDiv=false;
          console.log('Documento editado exitósamente');
        }, (error) => {
          console.log(error);
        });
      }
      else
      {
        this.jueganService.eliminarJugador(this.juegan[index].id).then(()=>{
          console.log('Documento eliminado exitósamente');
        }, (error) => {
          console.log(error);
        });
      }
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
      habitual
      };
      //    console.log('jugador=', this.jugador);
      this.jueganService.agregarJugador(this.jugador).then(()=>{
        console.log('Documento agregado exitósamente');
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
    window.open("https://api.whatsapp.com/send?text=Ingresá aquí www.quienjuega.com.ar/grupo/"+ this.linkGrupo + " para sumarte");
  }

  back(){
    this.grupoService.removeCodigoGrupo();
    this.gruposService.setCodigoGrupo(this.linkGrupo);
    this.router.navigate(['/']);
  }

  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.juegan=[];
    this.subscription?.unsubscribe();
  }
  
}
