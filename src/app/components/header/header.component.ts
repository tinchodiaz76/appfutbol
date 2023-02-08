import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
//Servicios
import { JueganService } from 'src/app/services/juegan.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { JugadoresService } from 'src/app/services/jugadores.service';
import { GruposService } from 'src/app/services/grupos.service';

//Rutas
import { Router } from '@angular/router';

import { DialogoJugadorComponent } from '../dialogo-jugador/dialogo-jugador.component';
//FontAwasome
import { faCopy, faRightFromBracket, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons'
//Variables de Entorno
import { environment } from 'src/environments/environment';
//Copy
import { ClipboardService } from 'ngx-clipboard';
import { Time } from '@angular/common';
import { UtilidadesService } from 'src/app/services/utilidades.service';

export interface DialogData {
  cantJugadores: number,
  nombre: string,
  check: boolean
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {


  juegan :jugadorHabitualModel[]=[];
  noJuegan :jugadorHabitualModel[]=[];
  existeNombre :jugadorHabitualModel[]=[];
  showDiv: boolean= false;
  fecha: string='';
  idGrupo!: string;
  title!:string;
  dia!:number;
  precio!:number;
//  jugador!: jugadorHabitualModel;
  jugador: any;
  cantIntegrantes: number=0;
  direccion!:string;
  hora!:Time;
  nombreDia!: string;
  linkGrupo!: string
  infoGrupo:boolean=false;
  infoJugadores: boolean=false;
  cargando:boolean=true;
  
  faCopy= faCopy;
  faRightFromBracket= faRightFromBracket;
  faPlus=faPlus;
  faWhatsapp= faWhatsapp;

  constructor(public dialog: MatDialog,
              private jueganService: JueganService,
              private alertasService: AlertasService,
              private jugadoresService: JugadoresService,
              private router: Router,
              private gruposService: GruposService,
              private clipboardApi: ClipboardService,
              private utilidades:UtilidadesService
              ) 
              
  { 
    //Traigo los que juegan
    this.jugadoresService.getJuegan().subscribe((res)=>{
//      console.log('this.juegan=', res);
      this.juegan=res;

      this.jugadoresService.getNoJuegan().subscribe((res)=>{
//        console.log('this.noJuegan=', res);
        this.noJuegan=res;

        this.infoJugadores=true;
      });
    });

    this.idGrupo= this.gruposService.obtengoIdGrupo(this.router.url);

    this.gruposService.getGrupo(this.idGrupo).subscribe((res:any)=>{
      if (res.payload.data())
      {
        
        this.title= res.payload.data().nombre;
        this.cantIntegrantes= res.payload.data().cantIntegrantes;
        this.dia= res.payload.data().dia;
        this.precio= res.payload.data().precio;
        this.direccion= res.payload.data().direccion;
        this.hora= res.payload.data().hora;

        switch (this.dia) {
          case 0:
            //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
            this.nombreDia='Domingo';
            break;
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
          default:
            this.nombreDia='Sabado';
            break;
        }

        this.linkGrupo=res.payload.id;

        this.fecha= this.utilidades.fechaProximoDia(this.dia);
        this.fecha= this.fecha.substring(6,8) + '/' + this.fecha.substring(4,6) + '/' + this.fecha.substring(0,4);

        if (this.juegan.length==10)
        {
          this.alertasService.mostratSwettAlert('', '¡Ya somos 10!','success');
        }
      }
      else
      {
        if (this.cantIntegrantes==0)
        {
          this.alertasService.mostratSwettAlert('', 'El grupo no existe','error');
          this.router.navigate(['/']);
        }
      }
      this.infoGrupo=true;
      this.cargando=false;
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

    console.log('jugador=', this.jugador);
    
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