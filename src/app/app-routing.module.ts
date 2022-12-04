import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoHabitualesComponent } from './components/listado-habituales/listado-habituales.component';

const routes: Routes = [
  {path:'', component:ListadoHabitualesComponent},
  {path:'**', pathMatch:'full', redirectTo:''}
];

@NgModule({
  imports: 
    [RouterModule.forRoot(routes)],
  exports: 
    [RouterModule]
})
export class AppRoutingModule { }
