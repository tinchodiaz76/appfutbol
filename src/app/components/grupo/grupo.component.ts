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
import { faCopy } from '@fortawesome/free-solid-svg-icons';
//Variables de Entorno
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})

export class GrupoComponent implements OnInit {
  grupo!: FormGroup;
  estado: boolean=false;
  nroGrupo: number=0;
  grupoInsert!: grupoModel;
  idGrupo!: string;
  puedeNavegar: boolean= false;
  linkGrupo!: string;
  
  faCopy= faCopy;

  grabo=true;

  constructor(private grupoService: GruposService,
              private alertasService: AlertasService,
              private router: Router,
              private jueganService: JueganService,
              private clipboardApi: ClipboardService
              ) { }

  ngOnInit(): void 
  {
    this.puedeNavegar=false;
    this.grupo = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cantIntegrantes: new FormControl('', [Validators.required]),
      dia: new FormControl('', [Validators.required])
    });
  }

  onSubmit()
  {
    if (this.grupo.get('cantIntegrantes')?.value!='Selecciona...')
    {
      if (this.grupo.get('dia')?.value!='Selecciona...')
      {
          this.grupoInsert={
            nombre:this.jueganService.casteaNombre(this.grupo.get('nombre')?.value),
            cantIntegrantes: parseInt(this.grupo.get('cantIntegrantes')?.value),
            fechaCreacion: new Date(),
            dia: parseInt(this.grupo.get('dia')?.value)
          }
            
          this.grupoService.agregarGrupo(this.grupoInsert).then((res:any)=>{
            this.alertasService.mostratSwettAlert('','¡Dimos de alta al equipo!','success');
        
            this.idGrupo= res.id;

            this.linkGrupo=environment.baseUrl+ 'grupo/' + res.id;
            this.puedeNavegar=true;
            this.grabo=false;
          },
          (error)=>{
            console.log('error=', error);
          })
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

}
