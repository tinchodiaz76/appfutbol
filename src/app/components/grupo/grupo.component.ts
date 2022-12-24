import { Component, OnInit } from '@angular/core';
import { GruposService } from 'src/app/services/grupos.service';
import { grupoModel } from 'src/app/models/grupo.model';
//Servicios
import { AlertasService } from 'src/app/services/alertas.service';
//FormControl 
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { JueganService } from 'src/app/services/juegan.service';
//Copy
import { ClipboardService } from 'ngx-clipboard';
//FontAwasome
import { faCopy, faFloppyDisk, faFutbol, faSquareCaretLeft, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})

export class GrupoComponent implements OnInit {
  grupoForm!: FormGroup;
  estado: boolean=false;
  nroGrupo: number=0;
  grupo!: grupoModel;
  idGrupo!: string;
  puedeNavegar: boolean= false;
  linkGrupo!: string;
  
  faCopy= faCopy;
  faFloppyDisk= faFloppyDisk;
  faFutbol= faFutbol;
  faSquareCaretLeft= faSquareCaretLeft;
  faRightFromBracket= faRightFromBracket
  grabo=true;

  constructor(private grupoService: GruposService,
              private alertasService: AlertasService,
              private router: Router,
              private jueganService: JueganService,
              private clipboardApi: ClipboardService
              ) { }

  ngOnInit(): void 
  {
    this.grupoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cantIntegrantes: new FormControl('', [Validators.required]),
      dia: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required, Validators.minLength(3)]),
      hora: new FormControl('', [Validators.required]),
      precio: new FormControl('', [Validators.required])
    });

    console.log(this.router.url);

    this.idGrupo= this.grupoService.obtengoIdGrupo(this.router.url);

    if (this.idGrupo!='grupo')
    {
        this.grupoService.getGrupo(this.idGrupo).subscribe((res:any)=>{
          console.log('res=', res.payload.data());
          this.grupoForm.setValue({nombre: res.payload.data().nombre, cantIntegrantes: res.payload.data().cantIntegrantes,
                              dia:res.payload.data().dia, direccion:res.payload.data().direccion, hora: res.payload.data().hora,
                              precio: res.payload.data().precio})
        });
    }

    this.puedeNavegar=false;
  }

  onSubmit()
  {
    if (this.grupoForm.get('cantIntegrantes')?.value!='Selecciona...')
    {
      if (this.grupoForm.get('dia')?.value!='Selecciona...')
      {
        if (this.idGrupo=='grupo')
        {
          //Es un grupo nuevo
          this.grupo={
            nombre:this.jueganService.castea(this.grupoForm.get('nombre')?.value),
            cantIntegrantes: parseInt(this.grupoForm.get('cantIntegrantes')?.value),
            fechaCreacion: new Date(),
            dia: parseInt(this.grupoForm.get('dia')?.value),
            direccion: this.jueganService.castea(this.jueganService.castea(this.grupoForm.get('direccion')?.value)),
            hora: this.grupoForm.get('hora')?.value,
            precio: this.grupoForm.get('precio')?.value
          }
          
          console.log('this.grupo=', this.grupo);
          this.grupoService.agregarGrupo(this.grupo).then((res:any)=>{
            this.alertasService.mostratSwettAlert('','¡Listo hay equipo!','success');
        
            this.idGrupo= res.id;

            this.linkGrupo=res.id;
            this.puedeNavegar=true;
            this.grabo=false;
          },
          (error)=>{
            console.log('error=', error);
          })
        }
        else
        {
          //Es un modificacion
          this.grupo={
            nombre:this.jueganService.castea(this.grupoForm.get('nombre')?.value),
            cantIntegrantes: parseInt(this.grupoForm.get('cantIntegrantes')?.value),
            fechaCreacion: new Date(),
            dia: parseInt(this.grupoForm.get('dia')?.value),
            direccion: this.grupoForm.get('direccion')?.value,
            hora: this.grupoForm.get('hora')?.value,
            precio: this.grupoForm.get('precio')?.value
          }
          
          this.grupoService.actualizarGrupo(this.idGrupo, this.grupo).then(()=>{
      //      console.log('Jugador Agregado con Exito');
            this.alertasService.mostratSwettAlert('', '¡Se modifico el grupo!', 'success');

          }).catch(error=>{
            console.log(error);
          });
        }
      }
      else
      {
        this.alertasService.mostratSwettAlert('','Debe seleccionar el día','error');
      }
    }
    else
    {
      this.alertasService.mostratSwettAlert('','Debe seleccionar la cantidad de jugadores','error');
    }
  }

  navegarGrupo()
  {
    this.router.navigate(['/grupo', this.idGrupo]);
  }

  copyText() {
    this.clipboardApi.copyFromContent(this.linkGrupo);
  }

  back()
  {
    this.router.navigate(['/']);
  }

}
