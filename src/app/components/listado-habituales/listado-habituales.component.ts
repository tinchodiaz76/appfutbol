import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
import { HabitualService } from 'src/app/services/habitual.service';
import { JueganService } from 'src/app/services/juegan.service';

/* sweetalert2 */
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-listado-habituales',
  templateUrl: './listado-habituales.component.html',
  styleUrls: ['./listado-habituales.component.css']
})
export class ListadoHabitualesComponent implements OnInit {

  listaJugadoresHabituales: jugadorHabitualModel[]=[];

  listaJuegan: jugadorHabitualModel[]=[];
  seAnota :jugadorHabitualModel | undefined;

  useForm!: FormGroup;
  fecha: string='';
  loadingJugadores :boolean=true;

  constructor(private habitualService: HabitualService,
            private jueganService: JueganService
              ) { }

  ngOnInit(): void {

    this.useForm = new FormGroup({
      nombre: new FormControl('',[Validators.required, Validators.minLength(3)])
    });

    this.fechaProximoSabado();
    this.listaJugadoresHabituales=[];    
    this.traerJugadoresHabituales();
/*    this.juegan();*/
  }

  sumarDias(fecha: Date, dias: number){
    fecha.setDate(fecha.getDate() + dias);
/*    console.log(fecha.getMonth()+1);*/
    this.fecha= fecha.getDate() + '/' +  `${fecha.getMonth()+1}` + '/' + fecha.getFullYear();
  }
  
  fechaProximoSabado()
  {
    var d = new Date();
    var nrodia:number= d.getDay();
/*    console.log(this.sumarDias(d, 6-nrodia));*/
  }

  juegan()
  {
      this.jueganService.traerJugadores().subscribe((res:jugadorHabitualModel[])=>{
        this.listaJuegan= res;
        
        this.loadingJugadores=false;

        if (this.listaJuegan.length===10)
        {
          this.mostratSwettAlertToast('Somos 10!!!','success');
        }
      })
  }

  traerJugadoresHabituales()
  {
    this.habitualService.traerJugadorHabitual().subscribe((res :jugadorHabitualModel[])=>{
      this.listaJugadoresHabituales= res;

      this.juegan();

/*      console.log('this.listaJugadoresHabituales=', this.listaJugadoresHabituales);*/
    })
  }


  cambiarEstado(estado: boolean, index: number){
    
    this.listaJugadoresHabituales[index].juega= true;

    this.habitualService.actualizarJugadorHabitual(this.listaJugadoresHabituales[index]).subscribe((res:jugadorHabitualModel)=>{
/*      console.log('actualizarJugadorHabitual--->res=', res);*/

      this. mostratSwettAlertToast('Jugas!!!', 'success')

      this.traerJugadoresHabituales();

      this.irArriba();
    }, err => {
      this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
    });
  }

  cambiarEstadoJuega(estado: boolean, index:number)
  {
    this.listaJuegan[index].juega= false;

    this.jueganService.actualizarJugador(this.listaJuegan[index]).subscribe((res:jugadorHabitualModel)=>{
/*      console.log('actualizarJugadorHabitual--->res=', res);*/

      this.traerJugadoresHabituales();

      this.irArriba();
    }, err => {
      this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
    });
  }

  anotate()  
  {

/*    console.log(this.useForm);*/
/*    console.log(this.useForm.errors);*/

    if (this.useForm['status']=='VALID')
    {
      this.seAnota={
        nombre: this.useForm.value['nombre'],
        juega: true,
        habitual: false,
        activo: true
        };
  
      this.habitualService.crearJugadorHabitual(this.seAnota).subscribe(res=>{
/*        console.log('res=', res);*/
        
        this. mostratSwettAlertToast('Jugas!!!', 'success')

        this.useForm.setValue({nombre:''});

        this.traerJugadoresHabituales();

        this.irArriba();
      }, err => {
        this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
      });
    }
    else
    {
      if (this.useForm.value['nombre']=='')
      {
        
        this. mostratSwettAlert('Debe ingresar el Nombre.', 'error')
      }
      else
      {
        this. mostratSwettAlert('El nombre debe tener al menos 3 caracteres.', 'error')
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
