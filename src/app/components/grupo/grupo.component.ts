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
  idGrupo!: string;
  puedeNavegar: boolean= false;

  constructor(private grupoService: GruposService,
              private alertasService: AlertasService,
              private router: Router,
              private jueganService: JueganService
              ) { }

  ngOnInit(): void 
  {
    this.puedeNavegar=false;
    this.grupo = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cantIntegrantes: new FormControl('', [Validators.required, Validators.minLength(1),Validators.maxLength(2)]),
      linkGrupo: new FormControl('')
    });
  }

  onSubmit()
  {

    this.grupoInsert={
      nombre: this.jueganService.casteaNombre(this.grupo.get('nombre')?.value),
      cantIntegrantes: parseInt(this.grupo.get('cantIntegrantes')?.value),
      fechaCreacion: new Date(),
    }
      
    this.grupoInsert={
      nombre:this.jueganService.casteaNombre(this.grupo.get('nombre')?.value),
      cantIntegrantes: parseInt(this.grupo.get('cantIntegrantes')?.value),
      fechaCreacion: new Date(),
    }
      
    this.grupoService.agregarGrupo(this.grupoInsert).then((res:any)=>{
      this.alertasService.mostratSwettAlert('','Dimos de alta el grupo!.','success');
  
      this.idGrupo= res.id;
      //this.grupo.setValue({linkGrupo: this.router.url + '/grupo/' + res.id});
      //this.grupo.setValue({linkGrupo: '1111'});
      this.grupo.controls['linkGrupo'].setValue(this.router.url + 'grupo/' + res.id);
      this.puedeNavegar=true;
//      this.router.navigate(['/grupo', res.id]);


    },
    (error)=>{
      console.log('error=', error);
    })
  }

  navegarGrupo()
  {
    this.router.navigate(['/grupo', this.idGrupo]);
  }
}
