import { Injectable } from '@angular/core';
//Para el login con GMAIL//
//import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged, signOut } from "firebase/auth";
//Para el login con GMAIL//
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Observer, Subscription} from 'rxjs';
import { Router } from '@angular/router';
import { GruposService } from './grupos.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  credential: any;
  subscription: Subscription | undefined;

  constructor(//public auth: Auth,
              private firestore: AngularFirestore,
              private router: Router,
              private grupoService: GruposService,
              private activatedRoute: ActivatedRoute
    ) { }

  getValidateUser(email: any):Observable<any>
  {
    return this.firestore.collection('users', ref => ref.where('email', '==', email)).snapshotChanges();
//    return this.firestore.collection('jugadores').doc(idGrupo).snapshotChanges();
  }

  addUser(user: any) : Promise<any>
  {
  
    return this.firestore.collection('users').add(user);
  }

  login(proveedor: string)
  {
      let partir:any=[];

        const provider = new GoogleAuthProvider();

        const auth = getAuth();
        signInWithPopup(auth, provider)
          .then((result) => {

            // This gives you a Google Access Token. You can use it to access the Google API.
            this.credential = GoogleAuthProvider.credentialFromResult(result);
            const token = this.credential.accessToken;
            console.log('token='+ token);
            // The signed-in user info.
            const user = result.user;
            console.log('user='+ user);

      
            let claves = Object.keys(user); // claves = ["nombre", "color", "macho", "edad"]
            for(let i=0; i< claves.length; i++){
              let clave = claves[i];
//              console.log(clave)
//              console.log(user.displayName);
//              console.log(user.uid);
            }
//            console.log(user.displayName);
//            console.log(user.email);

            this.subscription = this.getValidateUser(user.email).subscribe((res:any)=>{
              if (res.length==0)
              {
                this.addUser({nombre: user.displayName, email: user.email}).then((res:any)=>{

                  this.grupoService.setLlave({email: user.email});
                  this.grupoService.setLlave({nombre: user.displayName});

                  if (this.activatedRoute.snapshot.queryParams['returnUrl'])
                  {
                    partir= this.activatedRoute.snapshot.queryParams['returnUrl'].split('/')
                    //Me quedo con el idCodigo
                    this.router.navigate(['/grupo', partir[2]]);
                  }
                  else
                  {
                    this.router.navigate(['/home']);
                  }
                },
                (error)=>{
                  console.log('error=', error);
                })
              }
              else
              {
                console.log('Bienvenido, '+ user.displayName);

                this.grupoService.setLlave({email: user.email});
                this.grupoService.setLlave({nombre: user.displayName});
                
//                console.log(res[0].payload.doc.id);
                this.grupoService.setLlave({uid: res[0].payload.doc.id});

                if (this.activatedRoute.snapshot.queryParams['returnUrl'])
                {
                  partir= this.activatedRoute.snapshot.queryParams['returnUrl'].split('/')

//                  console.log(partir[1]);
//                  console.log(partir[2]);
          
                  this.router.navigate(['/grupo', partir[2]]);
                }
                else
                {
                  this.router.navigate(['/home']);
                }
              }
              this.subscription?.unsubscribe();
            });
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log('Sale del login')
      });
  }

  get isLoggedIn(): boolean {
    //const uid = JSON.parse(localStorage.getItem('uid')!);

    const uid= this.grupoService.getValorLlave('parametros').uid;
    return uid !== null && uid!=undefined ? true : false;
  }

  logout() {
    const auth = getAuth();
  
    auth.signOut()	
    .then(function() {
      console.log('Signout Succesfull');
    }, function(error) {
       console.log('Signout Failed')  
    });
  }

}


