import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
import { HabitualService } from 'src/app/services/habitual.service';
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

  constructor(private habitualesService: HabitualService
              ) { }

  ngOnInit(): void {
  }

  guardar(forms: NgForm)
  {

/*    console.log(forms);*/
/*    console.log(this.jugadorHabitual);*/

    if (this.jugadorHabitual.id)
    {
      this.habitualesService.actualizarJugadorHabitual(this.jugadorHabitual).subscribe((res:any)=>{
/*        console.log('res-->actualizarJugadorHabitual=', res);*/
      }, err => {
        this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
      });
    }
    else
    {
      this.habitualesService.crearJugadorHabitual(this.jugadorHabitual).subscribe(res=>{
/*        console.log('res-->crearJugadorHabitual=', res);*/
        this.mostratSwettAlertToast('Te agregaste a los de Siempre!!!', 'success');
      }, err => {
        this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
      });
    }

    this.jugadorHabitual['nombre']='';

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
