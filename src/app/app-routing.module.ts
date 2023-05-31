import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrupoComponent } from './components/grupo/grupo.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth/auth-guard';
import { AnotarseComponent } from './components/anotarse/anotarse.component';
import { HomeComponent } from './components/home/home.component';
import { EnviarMensajePushComponent } from './components/enviar-mensaje-push/enviar-mensaje-push.component';

const routes: Routes = [
  {path: '', component:LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'grupo/:id/mensaje', component:EnviarMensajePushComponent, canActivate:[AuthGuard],},
  {path: 'grupo', component: GrupoComponent, canActivate:[AuthGuard],},
  {path: 'grupo/edit/:id', component:GrupoComponent, canActivate:[AuthGuard],},
  {path: 'grupo/:id', component:AnotarseComponent, canActivate:[AuthGuard],},
  {path: '**', pathMatch:'full', redirectTo:''}
];

@NgModule({
  imports: 
    [RouterModule.forRoot(routes)],
  exports: 
    [RouterModule]
})
export class AppRoutingModule { }
