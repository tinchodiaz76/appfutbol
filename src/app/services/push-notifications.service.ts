import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Observable } from 'rxjs';
import { MessagePayload } from '../interfaces/notification-interfaces';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
//messaggingFirebase: firebase.messaging.Messaging;

constructor(private afMessaging: AngularFireMessaging) 
{ 

}

requestPermission=()=>{
  return new Promise(async (resolve, reject)=>{
    const permis= await Notification.requestPermission();

    if (permis==="granted")
    {
//        const tokenFirebase= this.afMessaging.getToken;
//        console.log('tokenFirebase=', tokenFirebase);
//        window.alert('tokenFirebase='+ tokenFirebase);
//        resolve(tokenFirebase);
      this.afMessaging.getToken.subscribe((currentToken:any)=>{
        if (currentToken) {
//            console.log(currentToken);
          resolve(currentToken);
          // ...
        } else {
//            console.log('No registration token available. Request permission to generate one.');
          reject( new Error ("No registration token available. Request permission to generate one"))
        }
      });
    }
    else
    {
      reject( new Error ("Nos e otorgaron los permisos"));
    }
  });
}

private messaginObservable= new Observable<MessagePayload>(observe=>{
  this.afMessaging.onMessage(payload=>{
    observe.next(payload);
  })
});

receiveMessage()
{
  return this.messaginObservable;
}
}
