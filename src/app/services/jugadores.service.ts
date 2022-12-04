import { Injectable } from '@angular/core';
import { JueganService } from './juegan.service';
import { jugadorHabitualModel } from '../models/habituales.model';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {

  private juegan$= new BehaviorSubject<jugadorHabitualModel[]>([]);
  private noJuegan$= new BehaviorSubject<jugadorHabitualModel[]>([]);

  constructor(private jueganService: JueganService) 
  { }

  seteoJuegan(juegan: any) :void
  {
    this.juegan$.next(juegan);

  }

  seteoNoJuegan(juegan: any) :void
  {
    this.noJuegan$.next(juegan);
  }

  getJuegan(){
   
    return this.juegan$.asObservable();
  }
  
  getNoJuegan(){
   
    return this.noJuegan$.asObservable();
  }

}
