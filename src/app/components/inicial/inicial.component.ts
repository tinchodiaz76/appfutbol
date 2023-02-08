import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPen, faPlus, faMagnifyingGlass, faPersonRunning, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons'
//Servicio
import { GruposService } from 'src/app/services/grupos.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { JueganService } from 'src/app/services/juegan.service';
/*
import { ThisReceiver } from '@angular/compiler';
import { exit } from 'process';
import { resolve } from 'dns';
*/
import { grupoModel } from 'src/app/models/grupo.model';
import { ClipboardService } from 'ngx-clipboard';

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
  faTrash= faTrash;
  faCopy= faCopy;
  faWhatsapp= faWhatsapp;

  codigo!: string;
  nombreEquipo!: string;
  codigoValido: boolean= false;
  fecha!: string;
  fechaActual!: Date;
  fechaHoy !: string;
  jugador: any;
  grupo!: grupoModel;
  idGrupo: string='';

  constructor(private router: Router,
              private gruposService: GruposService,
              private alertasService: AlertasService,
              private jueganService: JueganService,
              private grupoService: GruposService,
              private clipboardApi: ClipboardService) { }

  ngOnInit(): void {
    this.codigoValido=false;

    let codigo='';

    codigo= this.gruposService.getCodigoGrupo()

    if (codigo.length!=undefined)
    {
      this.codigo= this.gruposService.getCodigoGrupo();
      console.log('Codigo Grupo=', this.gruposService.getCodigoGrupo());
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
      console.log('res=', res);

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
        this.fechaActual=new Date();

        this.fechaHoy= this.fechaActual.getFullYear().toString()+((this.fechaActual.getMonth()+1).toString()).padStart(2,'0')+(this.fechaActual.getDate().toString()).padStart(2,'0');

        console.log('res.payload.data().fechaProximoPartido=' + parseInt(res.payload.data().fechaProximoPartido));
        console.log('this.fechaHoy=' + parseInt(this.fechaHoy));

        //Si la fechaProximoPartido de la coleccion GRUPOS es menor a la fecha del dia, juega=false

        if (parseInt(res.payload.data().fechaProximoPartido)<parseInt(this.fechaHoy)) 
        {
          //Le paso la fechaProximoPartido y el id del grupo
          console.log('fecha ultimo partido MENOR a fecha de hoy');
          console.log('res.payload.id=', res.payload.id);

          //Pongo todos los jugadores que pertenecen a ese grupo en juega=false
          this.falseJuega(res.payload.id);

          //Debo cambiar la fechaProximoPartido, en la coleccion GRUPOS.
          this.grupo={
            nombre:res.payload.data().nombre,
            cantIntegrantes: res.payload.data().cantIntegrantes,
            dia: res.payload.data().dia,
            direccion: res.payload.data().direccion,
            hora: res.payload.data().hora,
            precio: res.payload.data().precio,
            fechaProximoPartido: (parseInt(res.payload.data().precio) + 6).toString(),
            juegaTorneo: res.payload.data().juegaTorneo,
            mail: res.payload.data().mail
          }
          
          this.idGrupo= this.grupoService.obtengoIdGrupo(this.router.url)

          this.grupoService.actualizarGrupo(this.idGrupo, this.grupo).then(()=>{
            //console.log('Jugador Agregado con Exito');
            //this.alertasService.mostratSwettAlert('', '¡Se modifico el grupo!', 'success');
          }).catch(error=>{
            console.log(error);
          });          

        }          
        else
          console.log('fecha ultimo partido NOOOO ES MENOR a fecha de hoy');
      }
    })
  }

  eliminarCodigo()
  {
    this.codigo='';
    this.codigoValido=false;
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

  falseJuega(idGrupo: string)
  {
    //Paso el campo juega a false, si el jugador no fue modificado 
    this.jueganService.getJugadoresByGroup(idGrupo).subscribe((res:any)=>{
//      console.log('getJugadoresByGroup--->res=', res);
        res.forEach((element:any) => {
          if (element.payload.doc.data().juega)
          {
              this.jugador={
                        juega: false,
                        fechaActualizacion: new Date()
                      }

              this.jueganService.actualizarJugador(element.payload.doc.id , this.jugador).catch(error=>{
                console.log(error);
              });
          }
        });
    });
  }

  compartirWhatsapp() {

    //window.open("https://web.whatsapp.com/send?text=quienJuega-El codigo del grupo es: "+ this.codigo);
    window.open("https://api.whatsapp.com/send?text=Ingresá aquí www.quienjuega.com.ar/grupo/"+ this.codigo + " para sumarte");
    //this.clipboardApi.copyFromContent(this.codigo);
    //this.alertasService.mostratSwettAlertToast('Link copiado','success');
  }
}