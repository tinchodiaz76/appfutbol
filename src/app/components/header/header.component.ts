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
import { timeStamp } from 'console';

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
  nroGrupo!: number;
  title!:string;
  jugador!: jugadorHabitualModel;
  cantIntegrantes: number=0;

  constructor(public dialog: MatDialog,
              private jueganService: JueganService,
              private alertasService: AlertasService,
              private jugadoresService: JugadoresService,
              private router: Router,
              private gruposService: GruposService
              ) 
              
  { 
    //Traigo los que juegan
    this.jugadoresService.getJuegan().subscribe((res)=>{
//      console.log('this.juegan=', res);
      this.juegan=res;

      this.jugadoresService.getNoJuegan().subscribe((res)=>{
//        console.log('this.noJuegan=', res);
        this.noJuegan=res;
      });
    });

    this.nroGrupo= this.gruposService.obtengoNroGrupo(this.router.url);
    this.gruposService.getGrupo(this.nroGrupo).subscribe((res:any)=>{
      res.forEach((element:any) => {
        /*Acceso al ID*/
//        console.log(element.payload.doc.id);
        /*Acceso a los OBJETOS*/
        console.log(element.payload.doc.data());

        if (element.payload.doc.data()){
          this.title= element.payload.doc.data().nombre;
          this.cantIntegrantes= element.payload.doc.data().cantIntegrantes;
        }
      })
      if (this.title==undefined && this.cantIntegrantes==0)
      {
        this.alertasService.mostratSwettAlert('', 'El grupo no existe','error');
        this.router.navigate(['/']);
      }
      
    });

    this.fechaProximoSabado();
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

  insertaJugador(idGrupo: number, nombre:string, juega: boolean, activo: boolean, habitual: boolean, 
                 title: string, mensaje: string, icono: string
                 )

  {
    this.jugador={
      idGrupo,
      nombre, 
      juega, 
      activo,
      habitual,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
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
        
              if ((namesJuegan.includes(this.jueganService.casteaNombre(art.nombre))) || (namesNoJuegan.includes(this.jueganService.casteaNombre(art.nombre))))
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
                      this.insertaJugador(this.nroGrupo, this.jueganService.casteaNombre(art.nombre), true,true,art.check,
                        '¡Nos vemos el Sábado!','', 'success' );
                    }  
                    else
                    //Lo sumamos como habitual.
                    {
                      this.insertaJugador(this.nroGrupo, this.jueganService.casteaNombre(art.nombre), false, true,art.check,
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
                      this.insertaJugador(this.nroGrupo, this.jueganService.casteaNombre(art.nombre), false, true,art.check,
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
}