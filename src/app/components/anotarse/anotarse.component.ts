import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GruposService } from 'src/app/services/grupos.service';
import { JueganService } from 'src/app/services/juegan.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoJugadorComponent } from '../dialogo-jugador/dialogo-jugador.component';
//Iconos
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp} from '@fortawesome/free-brands-svg-icons'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { faHandPointUp, faHandPointDown } from '@fortawesome/free-solid-svg-icons';
//Servicio con varias utilidades
import { UtilidadesService } from 'src/app/services/utilidades.service';
//Para usar el modal
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//Spinner
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
//para manejar la fecha
import * as moment from 'moment';
import { grupoModel } from 'src/app/models/grupo.model';

@Component({
  selector: 'app-anotarse',
  templateUrl: './anotarse.component.html',
  styleUrls: ['./anotarse.component.css'],
  // add NgbModalConfig and NgbModal to the component providers
	providers: [NgbModalConfig, NgbModal],
})

export class AnotarseComponent implements OnInit {
  // A ESTE COMPONENTE SLO INGRESARA SI ES PARA ANOTARSE EN UN GRUPO QUE ME ENVIARON POR LINK DE WHATSAPP

  emailCreador: string='';
  faRightFromBracket= faRightFromBracket;
  faWhatsapp= faWhatsapp;
  faHandPointUp= faHandPointUp;
  faHandPointDown= faHandPointDown;

//  faHandBackFist= faHandBackFist
  faUserCheck= faUserCheck
  jugador: any;

  voy :boolean=false;
  noVoy :boolean=false;
  uid : string='';
  idGrupo: string='';
  nombreCreador: string='';
  nombreGrupo :string='';
//  fechaCreacion: Date | undefined;
  direccionGrupo :string='';
  diaGrupo :number=0; //string='';
  horaGrupo: any;
  precioGrupo: number=0;
  juegaTorneoGrupo: boolean=false;
  mailGrupo: string='';
  emailCreadorGrupo: string='';

  grupo!: grupoModel;
  
  dia: any=['Lunes','Martes','Miercoles','Jueves', 'Viernes', 'Sabado', 'Domingo']
  objeto: any=[];
  showDivCarga: boolean=false;
  showDiv: boolean=false;
  cantIntegrantes: number=0;
  cantJuegan: number=0;
  partir :any=[];
  
  //
  noHayJugadores: boolean= false;

  bodyText = 'This text can be updated in modal 1';
  //
  juegan: any=[];
  //
  value!:string;  //Precio por cabeza
  //Spinner
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  //Fecha ärtido
  fechaPartido: Date | undefined;

  constructor(private gruposService: GruposService,
            private router: Router,
            private grupoService: GruposService,
            private jueganService: JueganService,
            private alertasService:AlertasService,
            private utilidadesService: UtilidadesService,
            public dialog: MatDialog,
            private modalService: NgbModal
            ) { }

  ngOnInit(): void {
    this.showDivCarga= true;

    this.nombreCreador= this.gruposService.getValorLlave('parametros').nombre;
    this.uid= this.gruposService.getValorLlave('parametros').uid;

    this.partir= this.router.url.split('/');

    this.idGrupo= this.partir[2];
    this.juegan=[];

    Promise.all([this.getDatosGrupo(), this.jugadorbyGrupos()]).then(values => {
      this.showDivCarga= false;
    });
  }

  getDatosGrupo(): Promise<any>
  {
    return new Promise((resolve)=>{
      //Busco los datos del GRUPO
      let datosGrupo= this.grupoService.getGrupo(this.idGrupo).subscribe((res:any)=>{
        //          console.log('res=', res.payload.data());
        
        this.nombreGrupo= res.payload.data().nombre;
        this.direccionGrupo= res.payload.data().direccion;
        this.cantIntegrantes= res.payload.data().cantIntegrantes;
        //this.dia muestar el dia de la semana
        this.dia= this.dia[(res.payload.data().dia-1)]; 
        //this.diaGrupo Alamacena en numero de dia que me viene de la BD
        this.diaGrupo=res.payload.data().dia;
        this.horaGrupo= res.payload.data().hora;
        this.precioGrupo= res.payload.data().precio;
        this.juegaTorneoGrupo= res.payload.data().juegaTorneo;
        this.mailGrupo= res.payload.data().mail;
        this.emailCreadorGrupo= res.payload.data().emailCreador;
//        console.log(this.nombreGrupo);
//        console.log(this.direccionGrupo);
//        console.log(this.diaGrupo);
        
        datosGrupo.unsubscribe();
        resolve(true);  

        this.fechaPartido= res.payload.data().fechaProximoPartido;
      });
    });
  };

  jugadorbyGrupos(): Promise<any>
  {

    return new Promise((resolve)=>{
    //Traigo la los jugadores existentes en el GRUPO de JUGADORBYGRUPO
    let jugadoresPorGrupo= this.jueganService.getJugadoresByGrupo(this.idGrupo).subscribe((cantSnapshot) => {
      if (cantSnapshot.length>0)
      {
        cantSnapshot.forEach((catData: any) => {
          if (catData.payload.doc.data().juega)
          {
            this.cantJuegan= this.cantJuegan+1;

            this.juegan.push({
              alias: catData.payload.doc.data().alias
            });
          };

          if (catData.payload.doc.data().idUser===this.uid)
          {
            if (moment(this.fechaPartido).isBefore(moment().format('L')))
            {
              //Camio fechaProximoPartido de GRUPOS
              this.grupo={
                nombre:this.nombreGrupo,
                cantIntegrantes: this.cantIntegrantes,
                //fechaCreacion: new Date(),
                dia: this.diaGrupo,
                direccion: this.direccionGrupo,
                hora: this.horaGrupo,
                precio: this.precioGrupo,
                fechaProximoPartido: this.utilidadesService.buscar(this.diaGrupo),
                juegaTorneo: this.juegaTorneoGrupo,
                mail: this.mailGrupo,
                emailCreador: this.emailCreadorGrupo
              };

              this.grupoService.actualizarGrupo(this.idGrupo, this.grupo).then(()=>{
                //Pongo todos los jugadores de JUGADORBYGRUPOS en juega=false                
                this.jueganService.falseJuega(this.idGrupo);
              });
            }
            if (catData.payload.doc.data().juega)
            {
              this.voy=true;
              this.noVoy=false;
            }
            else
            {
              this.voy=false;
              this.noVoy=true;
            }
          }


        });

        if (this.juegan.length>0)
          this.noHayJugadores= false;
        else
          this.noHayJugadores= true;
      }
      else
      {
        this.voy=false
        this.noVoy=false;
        this.noHayJugadores= true;
      }
      
      if (this.cantJuegan>0)
        this.value=(this.precioGrupo/this.cantJuegan).toFixed(2);
      else
        this.value='0';

      if (this.cantJuegan===10)
      {
        this.voy=true;
        this.noVoy=true;
      }
      jugadoresPorGrupo.unsubscribe();
      resolve(true);
      });
    });
  }
  

  async cambio(estado: boolean)
  {
    console.log(estado);
    let partir: any=[];
    let coincidencia: boolean=false;
    let vId: string='';
    let vAlias: string='';
    let id: string='';
    let idUser: string='';
    this.emailCreador= this.grupoService.getValorLlave('email');
    partir= this.router.url.split('/');
///1
    let grupoDeUnJugador= this.jueganService.getJugadorbyGrupo(this.idGrupo).subscribe(async (gruposSnapshot) => {
      if (gruposSnapshot.length>0)
      {
          //si ya existe un registro en JUGADORBYGRUPO para el idGrupo
          //cambiar el juega de false a true o de true a false.
          gruposSnapshot.forEach((catData: any) => {
            vId=catData.payload.doc.id;

            if (catData.payload.doc.data().idUser===this.uid)
            {
              coincidencia= true;
              vAlias= catData.payload.doc.data().alias;
              id= catData.payload.doc.id;
              idUser= catData.payload.doc.data().idUser;
            }
          });

          if (!coincidencia)
          {
///2            
            this.abrirDialogo(this.nombreCreador, estado, this.idGrupo, 'insert','');
          }
          else
          {
            if (estado)
            {
              //Revisar que no haya un alias igual en el idGrupo=partir[2]
///3              
              let pepe= await this.aliasDuplicado(this.idGrupo, vAlias, idUser);
              if (pepe)
              {
                this.alertasService.mostratSwettAlert('¡Ya existe un Jugador con ese nombre!', '', 'error');
///4                
                this.abrirDialogo(vAlias, estado, this.idGrupo, 'update', id);
              }
              else
              {
                this.objeto={
                  activo: true, 
                  habitual: true,
///5                  
                  idGrupo: this.idGrupo,
                  idUser: this.uid,
                  juega: estado,
                  alias:vAlias
                };
  
                this.seteaJugador(id, this.objeto);
              }
            }
            else
            {
              this.objeto={
                activo: true, 
                habitual: true,
///6                
                idGrupo: this.idGrupo,
                idUser: this.uid,
                juega: estado,
                alias:vAlias
              };

              this.seteaJugador(id, this.objeto);
            }
          }
      }
      else
      {
        //No existe un registro en JUGADORBYGRUPO para el idGrupo
///7
        this.abrirDialogo(this.nombreCreador,estado, this.idGrupo,'insert', '');
      }
      grupoDeUnJugador.unsubscribe();
    });
  }

  aliasDuplicado(idGrupo: string, alias:string, idUser: string): Promise<any>{
    let vExiste= false;

    return new Promise((resolve)=>{
      let jugadoresPorGrupo= this.jueganService.getJugadoresByGrupo(idGrupo).subscribe((jugadoresSnapshot) => {
          if (jugadoresSnapshot.length>0)
          {
            jugadoresSnapshot.forEach((catData: any) => {

              if (catData.payload.doc.data().alias.toUpperCase()===alias.toUpperCase() && catData.payload.doc.data().idUser!=idUser)
              {
                vExiste=true;
              }
            });
          }
          jugadoresPorGrupo.unsubscribe();

          
          if (vExiste)
          {
            resolve(true);
          }
          else
          {
            resolve(false);
          }
      });
    });
  }

  abrirDialogo(nombre: string , estado: boolean, idGrupo:string,sentencia: string, id:string)
  {
    let v_existe:boolean= false;

    this.objeto={
      activo: true, 
      habitual: true,
      idGrupo:idGrupo,
      idUser: this.uid,
      juega: estado
    };

    const dialogo1= this.dialog.open(DialogoJugadorComponent, {
      data: {cantJugadores: 0, nombre: nombre, check: false},
    });

    dialogo1.afterClosed().subscribe(art => {

          if (art.nombre!='' || art=='undefined')
          //Controlo que haya ingresado un nomnbre
          {

              this.showDiv= true;
              //Trae todos los jugadore del grupo de JUGADORBYGRUPOS
              let jugadoresPorGrupo= this.jueganService.getJugadoresByGrupo(idGrupo).subscribe((jugadoresSnapshot) => {
                if (jugadoresSnapshot.length>0)
                {
                  jugadoresSnapshot.forEach((catData: any) => {

                    if (catData.payload.doc.data().alias.toUpperCase()===art.nombre.toUpperCase())
                    {
                      v_existe=true;
                    }
                  });
                }

                if (v_existe===true)
                {
                  this.showDiv= true;  
                  this.alertasService.mostratSwettAlert('¡Ya existe un Jugador con ese nombre!', '', 'error');
                }
                else
                {
                  if (sentencia==='insert')
                  {
                      this.objeto={...this.objeto, alias:this.jueganService.castea(art.nombre)};
                      //Insert en JUGADORBYGRUPO
                      this.jueganService.addJugadorbyGrupo(this.objeto).then(()=>{

                        if (estado)
                          this.showDiv=false;
                          this.alertasService.mostratSwettAlert('Excelente', 'Te sumaste '+ this.jueganService.castea(art.nombre) +'!', 'success')

                          //Refresco la ruta
                          this.utilidadesService.refreshRoute(idGrupo);
                      }).catch(error=>{
                      console.log(error);
                      });
                  }
                  else
                  {
                    this.objeto= {...this.objeto, juega: estado, alias: art.nombre}
                    this.seteaJugador(id, this.objeto);
                  }
                }
                jugadoresPorGrupo.unsubscribe();
              });
          }
          else
          {
              this.alertasService.mostratSwettAlert('¡Debe ingresar un nombre!','','error');
          }
    });
  }

  seteaJugador(id: string, objeto: any)
  {

    if (objeto.juega)
    {
      this.jueganService.setJugadorbyGrupo(id,objeto).then(()=>{
        this.alertasService.mostratSwettAlert('Excelente', 'Te sumaste '+ objeto.alias +'!', 'success');
  
        //Refresco la ruta
        this.utilidadesService.refreshRoute(this.idGrupo);
      }, (error) => {
        console.log(error);
      });

    }
    else
    {
        this.jueganService.setJugadorbyGrupo(id,objeto).then(()=>{
          this.alertasService.mostratSwettAlert('Ufa', 'Te bajaste '+ objeto.alias +'!', 'success');

          //Refresco la ruta
          this.utilidadesService.refreshRoute(this.idGrupo);
        }, (error) => {
          console.log(error);
        });
    }
  }

  back(){
    this.router.navigate(['/home']);
  }

  
  compartirWhatsapp() {
///8    
    window.open("https://api.whatsapp.com/send?text=Ingresá aquí https://www.quienjuega.com.ar/grupo/"+ this.idGrupo + " para sumarte");
  }

  verIntegrantes(content: any) {
		this.modalService.open(content);
	}
}