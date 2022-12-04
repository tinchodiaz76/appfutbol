import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
import { JueganService } from 'src/app/services/juegan.service';
import { AlertasService } from 'src/app/services/alertas.service';


import { DialogoJugadorComponent } from '../dialogo-jugador/dialogo-jugador.component';
import { JugadoresService } from 'src/app/services/jugadores.service';

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
  //nombre:string='';
  //check:number=0;

  juegan :jugadorHabitualModel[]=[];
  noJuegan :jugadorHabitualModel[]=[];

  existeNombre :jugadorHabitualModel[]=[];

  showDiv: boolean= false;

  constructor(public dialog: MatDialog,
              private jueganService: JueganService,
              private alertasService: AlertasService,
              private jugadoresService: JugadoresService
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
  }

  insertaJugador(nombre:string, juega: boolean, activo: boolean, habitual: boolean, 
                 title: string, mensaje: string, icono: string)
  {
    const jugador: any={
      nombre, 
      juega, 
      activo,
      habitual,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

//    console.log('jugador=', jugador);
    
    this.jueganService.agregarJugador(jugador).then(()=>{
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
                  if (this.juegan.length<10)
                  //Son menos de 10 jugadores para el proximo Sabado
                  {
                    if (!art.check)
                    //No quiere ser habitual, se suma para jugar este Sabado
                    {
                      this.insertaJugador(this.jueganService.casteaNombre(art.nombre), true,true,art.check,
                        '¡Nos vemos el Sábado!','', 'success' );
                    }  
                    else
                    //Lo sumamos como habitual.
                    {
                      this.insertaJugador(this.jueganService.casteaNombre(art.nombre), false, true,art.check,
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
                      this.insertaJugador(this.jueganService.casteaNombre(art.nombre), false, true,art.check,
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

