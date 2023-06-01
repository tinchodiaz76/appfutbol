import { Component, OnInit } from '@angular/core';
//Parametros de URL
import { Router, ActivatedRoute, Params  } from '@angular/router';
//Icono de fontawesome
import { faCirclePlus, faFutbol, faPenFancy, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
//Servicio de grupo
import { GruposService } from 'src/app/services/grupos.service';
import { LoginService } from 'src/app/services/login.service';
import { JueganService } from 'src/app/services/juegan.service';
import { AlertasService } from 'src/app/services/alertas.service';
//Icono Whatsapp
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons'
//Spinner
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { PushNotificationsService } from 'src/app/services/push-notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  faCirclePlus= faCirclePlus;
  faPenFancy= faPenFancy;
  faFutbol= faFutbol;
  faShareFromSquare= faShareFromSquare;
    
  emailCreador: string='';
  usuarioCreador: string='';
  uid: string='';
  anotarse: boolean= false;       //Permite anotarse en algun GRUPO en el cual este el usuario
  creaGrupo: boolean= false;      //Permite crear GRUPO
  modificaGrupo: boolean= false;  //Permite modificar GRUPO
  idGrupo: string=''; //Se guarda el IDGRUPO
  equipos: any=[];  //Se guarda los grupos a los que pertence el usuario logueado.
  grupo: string=''; //NGMODEL del SELECT de los GRUPOS.

  faWhatsapp= faWhatsapp;
  compartirLink :boolean=false;
  showDiv :boolean=false; //Se usa para el DIV del SPINNER
  //Spinner
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  user: any;
  messageReceived ='';
  bodyReceived='';

  constructor(private router: Router,
              private gruposService: GruposService,
              private activatedRoute: ActivatedRoute,
              private loginService: LoginService,
              private jueganService: JueganService,
              private grupoService: GruposService,
              private alertasService: AlertasService,
              private afMessaging: AngularFireMessaging,
              private notificacion: PushNotificationsService
             ) 
  { 
        
    notificacion.requestPermission().then(tokenDevice=>{
      console.log(tokenDevice);

      this.uid= this.gruposService.getValorLlave('parametros').uid;

      console.log('this.uid=', this.uid);

      let gruposByUsuario= this.jueganService.getUserById(this.uid).subscribe((res) => {
            
              this.user={
                email:res.payload.data().email,
                nombre:res.payload.data().nombre,
                tokenDevice: tokenDevice
              };

              this.jueganService.setJugadorbyId(res.payload.id,this.user).then(()=>{
                console.log('Se modifico Users');
                },(error)=>{
                  console.log(error);
              });
      gruposByUsuario.unsubscribe();
      });
    });
  }

  
  ngOnInit(): void 
  {
    this.notificacion.receiveMessage().subscribe((payload)=>{
      console.log(payload);

      this.messageReceived = payload.notification.title!;
      console.log('title ', this.messageReceived);
      this.bodyReceived = payload.notification.body!;
      console.log('body ', this.bodyReceived);
    });

    this.showDiv= true;

    this.equipos=[];

    this.emailCreador= this.gruposService.getValorLlave('parametros').email;

    this.usuarioCreador= this.gruposService.getValorLlave('parametros').nombre;

    //Verificar si tiene un equipo asociado en jugadorbygrupos
    //para habilitar ANOTATE.

    //Verifica si existe en USERS
    let jugador= this.jueganService.getJugadorByMail(this.emailCreador).subscribe((gruposSnapshot) => {

//      console.log('gruposSnapshot=', gruposSnapshot);

      gruposSnapshot.forEach((catData: any) => {
        //Si pertenece al grupo
//        console.log(catData.payload.doc.data());
//        console.log(catData.payload.doc.id);

        this.grupoService.setLlave({uid: catData.payload.doc.id});

        Promise.all([this.jugadorbyGrupos(), this.revisarGrupos(this.emailCreador)]).then(values => {
          this.showDiv= false;
        });

      });

      jugador.unsubscribe();
    });
  }

  async AceptarMensajesPush()
  {
    this.afMessaging.requestPermission
      .subscribe(async () => {
          window.alert('11111');
//        console.log('Adentro'); //message.innerHTML = "Notifications allowed";
        this.afMessaging.requestToken.subscribe((currentToken:any)=>{
          window.alert('currentToken=' + currentToken);

          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            console.log(currentToken);
            window.alert(currentToken);
            // ...
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
          }
        })
    });
  }


  jugadorbyGrupos() :Promise<any>
  {
    return new Promise((resolve)=>{

      this.uid= this.gruposService.getValorLlave('parametros').uid;
      console.log('this.uid=', this.uid);

      //Verifica si el usuario tiene un grupo asociado en JUGADORBYGRUPOS
      let gruposByUsuario= this.jueganService.getGruposPorJugador(this.uid).subscribe((gruposSnapshot) => {
        gruposSnapshot.forEach((catData: any) => {
          if (gruposSnapshot.length===0)
            this.anotarse=false;
          else
            this.anotarse=true;
        });
        gruposByUsuario.unsubscribe();
        resolve(true);
      });
    });
  }

  revisarGrupos(email: string): Promise<any>
  {
    
    return new Promise((resolve)=>{
    this.equipos=[];
      //Se fija si el usuario logueado tiene un grupo creado.
      let subscription = this.gruposService.getGrupoPorCreador(email).subscribe((res:any)=>{
//        console.log('res=', res);

        if (res.length>0)
        {
          //Tiene un grupo creado, solo habilitar la modificacion de grupo
          this.creaGrupo= false;
          this.modificaGrupo=true;
          this.idGrupo= res[0].payload.doc.id;
          
          //Traigo los grupos a los cuales pertenece el usuario logueado.
          this.buscaGrupo();
        }
        else
        {
          //No tiene grupo creado, permito la creacion del grupo
          this.creaGrupo=true;
          this.modificaGrupo=false;
          //Traigo los grupos a los cuales pertenece el usuario logueado.
          this.buscaGrupo();
        }
        subscription.unsubscribe();
        resolve(true);
      });
    });
  }

  buscaGrupo()
  {
    let obj: any={};
    this.equipos=[];

    //Busca todos los grupos a los cuales pertenece el usuario logueado.
    let grupoDeUnJugador= this.jueganService.getGruposbyJugador(this.uid).subscribe((gruposSnapshot) => {
      this.equipos.push({nombre: 'Selecciona...', idGrupo:'null'});

      gruposSnapshot.forEach((catData: any) => {
        //Si pertenece al grupo
        console.log(catData.payload.doc.data());
        console.log(catData.payload.doc.id);
        console.log(catData.payload.doc.data().idGrupo);
        //Obtengo los datos del grupo.
        //Entra por doc(idGrupo).
        let getGrupo= this.gruposService.getGrupo(catData.payload.doc.data().idGrupo).subscribe(res=>{
          if (res.payload.data()!=undefined)
          {
//              console.log(res.payload.data());

            if (res.payload.data().nombre!==undefined)
            {
              obj= {nombre:res.payload.data().nombre, idGrupo: catData.payload.doc.data().idGrupo};

//            console.log(obj);
              this.equipos.push(obj); //this.equipo, es el que lista el equipo en el select
            }
          }
          getGrupo.unsubscribe();
        });
     });
     grupoDeUnJugador.unsubscribe();
    })
  }

  editarGrupo()
  {
    this.router.navigateByUrl('grupo/edit/' + this.idGrupo);
  }

  mensajeGrupo()
  {
    this.router.navigateByUrl('grupo/' + this.idGrupo + '/mensaje');   
  }
  crearGrupo()
  {
    this.router.navigate(['grupo']);
  }

  anotate()
  {
    console.log(this.grupo);
    if (this.grupo==='' || this.grupo==='null') 
      this.alertasService.mostratSwettAlert('', 'Debe seleccionar un Grupo!', 'error');
    else
    {
      if (this.grupo!='' || this.grupo!=undefined)
        this.router.navigate(['/grupo', this.grupo]);
    }
  }

  changeSelect()
  {
    if (this.grupo!='null') 
      this.compartirLink=true;
    else
      this.compartirLink=false;
  }

  compartirWhatsapp() {
    window.open("https://api.whatsapp.com/send?text=Ingresá aquí https://www.quienjuega.com.ar/grupo/"+ this.grupo + " para sumarte");
  }

  logOut(proveedor: string)
  {
    this.loginService.logout();
    this.gruposService.removeLlave('parametros');
    this.router.navigate(['/']);
  }
}