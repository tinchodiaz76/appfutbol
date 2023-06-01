import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faRightFromBracket, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import { AlertasService } from 'src/app/services/alertas.service';
import { JueganService } from 'src/app/services/juegan.service';
//Servicio para la comunicacion con PHP
import { UtilidadesService } from 'src/app/services/utilidades.service';
//FormControl 
import { FormControl, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-enviar-mensaje-push',
  templateUrl: './enviar-mensaje-push.component.html',
  styleUrls: ['./enviar-mensaje-push.component.css']
})
export class EnviarMensajePushComponent implements OnInit {
  mensajeForm!: FormGroup;
  faRightFromBracket= faRightFromBracket;
  faPaperPlane= faPaperPlane
  partir: any=[];
  idGrupo: string='';

  constructor(private router: Router, 
              private jueganService: JueganService,
              private utilidadesService: UtilidadesService,
              private alertasService: AlertasService
              ) { }

  ngOnInit(): void 
  {
    this.mensajeForm = new FormGroup({
      mensaje: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });

    this.partir= this.router.url.split('/');

    this.idGrupo= this.partir[2];
  }

  enviarMensaje()
  {

    let jugadoresByGrupo= this.jueganService.getJugadorbyGrupo(this.idGrupo).subscribe(async (gruposSnapshot) => {
        console.log(gruposSnapshot.length);
        if (gruposSnapshot.length>0)
        {
            gruposSnapshot.forEach((catData: any) => {

//              console.log(catData.payload.doc.data().idUser);

              //Traigo los datos del usuario
              let usuario= this.jueganService.getUserById(catData.payload.doc.data().idUser).subscribe((res) => {
                console.log(res.payload.data().nombre + '  ' + res.payload.data().tokenDevice);

                if (res.payload.data().tokenDevice)
                {

                  this.utilidadesService.invocaPhp(res.payload.data().tokenDevice, this.mensajeForm.get('mensaje')?.value).subscribe((datos:any)=>{
                    this.alertasService.mostratSwettAlert('','Mensaje Enviado!','success');
/*                                        
                    if (datos['resultado']=='OK') {
                      

                      //alert(datos['mensaje']);
                      //this.recuperarTodos();
                    }                    
*/                    
                  });
                }
              usuario.unsubscribe();
              });
            });
        }
    jugadoresByGrupo.unsubscribe();
    })
  }

  back()
  {

    this.router.navigate(['home']);
  }

}
