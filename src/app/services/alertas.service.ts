import { Injectable } from '@angular/core';

import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() { }

  
  mostratSwettAlert(title: any, mensaje: any, icono:any)  
  {
    Swal.fire({
      title: title,
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

  mostratSwettAlertToast(mensaje: any, icono: any)
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
}
