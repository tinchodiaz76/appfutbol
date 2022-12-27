import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPen, faPlus, faMagnifyingGlass, faPersonRunning } from '@fortawesome/free-solid-svg-icons';
//Servicio
import { GruposService } from 'src/app/services/grupos.service';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.component.html',
  styleUrls: ['./inicial.component.css']
})
export class InicialComponent implements OnInit {

  faPen= faPen;
  faPlus= faPlus;
  faMagnifyingGlass= faMagnifyingGlass;
  faPersonRunning= faPersonRunning;

  codigo!: string;
  nombreEquipo!: string;
  codigoValido: boolean= false;

  constructor(private router: Router,
              private gruposService: GruposService,
              private alertasService: AlertasService) { }

  ngOnInit(): void {
    this.codigoValido=false;

    console.log(this.gruposService.getCodigoGrupo());

   let codigo='';

   codigo= this.gruposService.getCodigoGrupo()

    if (codigo.length!=undefined)
    {
      this.codigo= this.gruposService.getCodigoGrupo();
      this.validarCodigo();
    }
    else
    {
      this.codigo='';
    }
    
  }

  crearGrupo()
  {
    this.router.navigate(['grupo']);
  }

  validarCodigo()
  {
    this.gruposService.getGrupo(this.codigo).subscribe((res:any)=>{
      console.log('res=', res.payload.data());

      if (res.payload.data()==undefined)
      {
        this.alertasService.mostratSwettAlert('','El codigo no existe', 'error');
        this.codigoValido= false;
      }
      else
      {
        this.codigoValido= true;
        this.gruposService.setCodigoGrupo(this.codigo);
        this.nombreEquipo='Estás en ' + res.payload.data().nombre;

/*        
        this.router.navigate(['/grupo/edit', this.codigo]);
*/        

      }
    })
  }
  modificaGrupo()
  {
    this.router.navigate(['/grupo/edit', this.codigo]);
  }

  agregoJugador()
  {
    this.router.navigate(['/grupo', this.codigo])
  }

  codigoValue(event:any)
  {
    //window.alert(event.target.value);
    if (event.target.value=='')
    {
      this.codigoValido=false;
    }
  }
}
