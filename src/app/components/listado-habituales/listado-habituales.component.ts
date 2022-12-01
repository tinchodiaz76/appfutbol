import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { jugadorHabitualModel } from 'src/app/models/habituales.model';
import { HabitualService } from 'src/app/services/habitual.service';
import { JueganService } from 'src/app/services/juegan.service';

/* sweetalert2 */
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'


import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-listado-habituales',
  templateUrl: './listado-habituales.component.html',
  styleUrls: ['./listado-habituales.component.css']
})
export class ListadoHabitualesComponent implements OnInit {

  listaJugadoresHabituales: jugadorHabitualModel[]=[];
  jugadoresHabitualesNoJuegan: jugadorHabitualModel[]=[];

  listaJuegan: jugadorHabitualModel[]=[];
  seAnota :jugadorHabitualModel | undefined;

  useForm!: FormGroup;
  fecha: string='';
  loadingJugadores :boolean=true;
  showDiv: boolean=false;
  
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  nombre: string='';
  
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
    this.sumarDias(d, 6-nrodia);
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

  habitualesNoJuegan(jugadoresHabituales: jugadorHabitualModel[]) :any{

    this.listaJugadoresHabituales= this.listaJugadoresHabituales.filter(element=>
      !element.juega
    );

    return this.listaJugadoresHabituales;
  }

  traerJugadoresHabituales()
  {
    this.habitualService.traerJugadorHabitual().subscribe((res :jugadorHabitualModel[])=>{

      console.log('res=', res);
      this.listaJugadoresHabituales= res;
      this.jugadoresHabitualesNoJuegan= this.habitualesNoJuegan(res);

      console.log('this.listaJugadoresHabituales=', this.listaJugadoresHabituales);
      console.log('this.jugadoresHabitualesNoJuegan=', this.jugadoresHabitualesNoJuegan);
      //this.listaJugadoresHabituales= res;

      this.juegan();

/*      console.log('this.listaJugadoresHabituales=', this.listaJugadoresHabituales);*/
    })
  }


  cambiarEstado(estado: boolean, index: number){
    
    this.jugadoresHabitualesNoJuegan[index].juega=true

    //this.listaJugadoresHabituales[index].juega= true;

    //Bloque el DIV PRINCIPAL
    this.showDiv=true;

    this.habitualService.actualizarJugadorHabitual(this.jugadoresHabitualesNoJuegan[index]).subscribe((res:jugadorHabitualModel)=>{
/*      console.log('actualizarJugadorHabitual--->res=', res);*/

      this. mostratSwettAlertToast('Jugas!!!', 'success')

      this.traerJugadoresHabituales();

      this.irArriba();

      //Elimino el bloque el DIV PRINCIPAL
      this.showDiv=false;
    }, err => {
      this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');

      //Elimino el bloque el DIV PRINCIPAL
      this.showDiv=false;
    });
  }

  cambiarEstadoJuega(estado: boolean, index:number)
  {
    this.listaJuegan[index].juega= estado;

    //Bloque el DIV PRINCIPAL
    this.showDiv=true;

    this.jueganService.actualizarJugador(this.listaJuegan[index]).subscribe((res:jugadorHabitualModel)=>{
/*      console.log('actualizarJugadorHabitual--->res=', res);*/

      this.traerJugadoresHabituales();

      this.irArriba();
      
      //Elimino el bloque el DIV PRINCIPAL
      this.showDiv=false;
    }, err => {
      this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
            
      //Elimino el bloque el DIV PRINCIPAL
      this.showDiv=false;
    });
  }

  anotate()  
  {

/*    console.log(this.useForm);*/
/*    console.log(this.useForm.errors);*/

    if (this.useForm['status']=='VALID')
    {
      this.nombre='';

      this.nombre = this.jueganService.casteaNombre(this.useForm.value['nombre']);

      if ((!this.listaJugadoresHabituales.some(e => e.nombre === this.nombre)) && (
        !this.listaJuegan.some(p => p.nombre === this.nombre)
      ))
        //Si el nombre ingresado ya esta como habitual, no sigas
      {
          this.seAnota={
            nombre: this.nombre,//this.useForm.value['nombre'],
            juega: true,
            habitual: false,
            activo: true
            };
      
          //Bloque el DIV PRINCIPAL
          this.showDiv=true;

          this.habitualService.crearJugadorHabitual(this.seAnota).subscribe(res=>{
    //        console.log('res=', res);
            
            this. mostratSwettAlertToast('Jugas!!!', 'success')

            this.useForm.setValue({nombre:''});

            this.traerJugadoresHabituales();

            this.irArriba();

            //Elimino el bloque el DIV PRINCIPAL
            this.showDiv=false;
          }, err => {
            this.mostratSwettAlert('Ocurrio un error al grabar, intente mas tarde!!!', 'error');
                  
            //Elimino el bloque el DIV PRINCIPAL
            this.showDiv=false;
          });
      }
      else
      {
            this.mostratSwettAlert('Ya existe un Jugador con ese nombre','error');
      }
      
    }
    else
    {
      if (this.useForm.value['nombre']=='')
      {
        this. mostratSwettAlert('Debe ingresar el Nombre.', 'error')

        //Elimino el bloque el DIV PRINCIPAL
        this.showDiv=false;
      }
      else
      {
        this. mostratSwettAlert('El nombre debe tener al menos 3 caracteres.', 'error')

        //Elimino el bloque el DIV PRINCIPAL
        this.showDiv=false;
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
