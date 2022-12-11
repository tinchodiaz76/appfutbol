import { Component, OnInit } from '@angular/core';
import { GruposService } from 'src/app/services/grupos.service';
import { grupoModel } from 'src/app/models/grupo.model';
//Servicios
import { AlertasService } from 'src/app/services/alertas.service';
//FormControl 
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { JueganService } from 'src/app/services/juegan.service';

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

  constructor(private grupoService: GruposService,
              private alertasService: AlertasService,
              private router: Router,
              private jueganService: JueganService
              ) { }

  ngOnInit(): void 
  {
    this.grupo = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cantIntegrantes: new FormControl('', [Validators.required, Validators.minLength(1),Validators.maxLength(2)]),
      estado: new FormControl('',Validators.required)
    });
  }

  onSubmit()
  {
//    console.log('this.grupo.value=', this.grupo.value);

//    let grupoInsert:any={};

    if (this.grupo.get('estado')?.value==1)
      this.estado=true;
    else
      this.estado=false;

    this.grupoService.getGrupos().subscribe((res:any)=>{
      console.log('res=', res);
      this.nroGrupo= res.docs.length;



      if (res.docs.length==0)
      {
        this.nroGrupo= 1;

        this.grupoInsert={
          idGrupo:this.nroGrupo,
          nombre: this.jueganService.casteaNombre(this.grupo.get('nombre')?.value),
          cantIntegrantes: parseInt(this.grupo.get('cantIntegrantes')?.value),
          activo:this.estado,
          fechaCreacion: new Date(),
        }
      }
      else
      {
        this.nroGrupo= this.nroGrupo+1;
      
        this.grupoInsert={
          idGrupo:this.nroGrupo,
          nombre:this.jueganService.casteaNombre(this.grupo.get('nombre')?.value),
          cantIntegrantes: parseInt(this.grupo.get('cantIntegrantes')?.value),
          activo:this.estado,
          fechaCreacion: new Date(),
        }
      }
 
      this.grupoService.agregarGrupo(this.grupoInsert).then((res:any)=>{
        console.log('res=', res);
        this.alertasService.mostratSwettAlert('','Dimos de alta el grupo!.','success');
        this.router.navigate(['/grupo', this.nroGrupo]);
      },
      (error)=>{
        console.log('error=', error);
      })
    });
  }
}
