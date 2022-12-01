import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
import { HabitualService } from 'src/app/services/habitual.service';
import { JueganService } from 'src/app/services/juegan.service';
/* sweetalert2 */
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-agregar-habituales',
  templateUrl: './agregar-habituales.component.html',
  styleUrls: ['./agregar-habituales.component.css']
})
export class AgregarHabitualesComponent implements OnInit {

  jugadorHabitual: jugadorHabitualModel= new jugadorHabitualModel();
  listaJugadoresHabituales: jugadorHabitualModel[]=[];
  nombre: string='';

  constructor(private habitualService: HabitualService,
              private jueganService: JueganService
              ) { }

  ngOnInit(): void {
  }

  traerJugadoresHabituales()
  {
    this.habitualService.traerJugadorHabitual().subscribe((res :jugadorHabitualModel[])=>{
      this.listaJugadoresHabituales= res;
/*      console.log('this.listaJugadoresHabituales=', this.listaJugadoresHabituales);*/
    })
  }

  guardar(forms: NgForm)
  {

//    console.log(forms);
//    console.log(forms.controls['nombre'].value);

    this.nombre = this.jueganService.casteaNombre(forms.controls['nombre'].value);

    this.habitualService.traerJugadorHabitual().subscribe((res :jugadorHabitualModel[])=>{
      this.listaJugadoresHabituales= res;
    
      console.log('this.listaJugadoresHabituales=', this.listaJugadoresHabituales);


      if (!this.listaJugadoresHabituales.some(e => e.nombre === this.nombre))
      {
        console.log('Entraaaaa');
        this.jugadorHabitual.nombre= this.nombre;

        //Busco si ya esta agregado como Jugador Habitual
    
        if (this.jugadorHabitual.id)
        {
          this.habitualService.actualizarJugadorHabitual(this.jugadorHabitual).subscribe((res:any)=>{
    /*        console.log('res-->actualizarJugadorHabitual=', res);*/
          }, err => {
            this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
          });
        }
        else
        {
          this.habitualService.crearJugadorHabitual(this.jugadorHabitual).subscribe(res=>{
    /*        console.log('res-->crearJugadorHabitual=', res);*/
            this.mostratSwettAlertToast('Te agregaste a los de Siempre!!!', 'success');
          }, err => {
            this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
          });
        }
    
        this.jugadorHabitual['nombre']='';
      }
      else
      {
        console.log('Noooooo Entraaaaa');
        this.mostratSwettAlert('Ya existe un Jugador con ese nombre','error');
      }
    })
  }

  mostratSwettAlertToast(mensaje: any, icono:any)  
  {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icono,
      title: mensaje
    })
  }

  mostratSwettAlert(mensaje: any, icono:any)  
  {
    Swal.fire({
      title: 'Atencion!',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      text: mensaje,
      icon: icono,
      confirmButtonText: 'Ok',
      showConfirmButton:true
    });
  }

}
