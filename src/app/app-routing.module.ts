import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarHabitualesComponent } from './components/agregar-habituales/agregar-habituales.component';
import { ListadoHabitualesComponent } from './components/listado-habituales/listado-habituales.component';

const routes: Routes = [
  {path:'agregar/jugador', component:AgregarHabitualesComponent},
  {path:'sejuega', component:ListadoHabitualesComponent},
  {path:'**', pathMatch:'full', redirectTo:'sejuega'}
];

@NgModule({
  imports: 
    [RouterModule.forRoot(routes)],
  exports: 
    [RouterModule]
})
export class AppRoutingModule { }
