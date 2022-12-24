import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoHabitualesComponent } from './components/listado-habituales/listado-habituales.component';
import { GrupoComponent } from './components/grupo/grupo.component';
import { InicialComponent } from './components/inicial/inicial.component';

const routes: Routes = [
  {path: '', component:InicialComponent},
  {path: 'grupo', component: GrupoComponent},
  {path: 'grupo/edit/:id', component:GrupoComponent },
  {path: 'grupo/:id', component:ListadoHabitualesComponent },
  {path: '**', pathMatch:'full', redirectTo:''}
];

@NgModule({
  imports: 
    [RouterModule.forRoot(routes)],
  exports: 
    [RouterModule]
})
export class AppRoutingModule { }
