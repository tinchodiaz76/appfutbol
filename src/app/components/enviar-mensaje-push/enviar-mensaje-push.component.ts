import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCopy, faFloppyDisk, faFutbol, faSquareCaretLeft, faRightFromBracket, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import { AlertasService } from 'src/app/services/alertas.service';
import { JueganService } from 'src/app/services/juegan.service';
import { UtilidadesService } from 'src/app/services/utilidades.service';

@Component({
  selector: 'app-enviar-mensaje-push',
  templateUrl: './enviar-mensaje-push.component.html',
  styleUrls: ['./enviar-mensaje-push.component.css']
})
export class EnviarMensajePushComponent implements OnInit {
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

              console.log(catData.payload.doc.data().idUser);

              //Traigo los datos del usuario
              let usuario= this.jueganService.getUserById(catData.payload.doc.data().idUser).subscribe((res) => {
                console.log(res.payload.data().nombre + '  ' + res.payload.data().tokenDevice);

                if (res.payload.data().tokenDevice)
                {
                  window.alert('El usuario ' + catData.payload.doc.data().idUser + ' tiene tokenDevice');

                  this.utilidadesService.invocaPhp(res.payload.data().tokenDevice, 'Martin Diaz').subscribe((datos:any)=>{
                    this.alertasService.mostratSwettAlert('','Mensaje Enviado!','success');
/*                                        
                    if (datos['resultado']=='OK') {
                      

                      //alert(datos['mensaje']);
                      //this.recuperarTodos();
                    }                    
*/                    
                  });
                }
                else
                {
                  window.alert('El usuario ' + catData.payload.doc.data().idUser + ' no tiene un tokenDevice')
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
