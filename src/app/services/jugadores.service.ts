import { Injectable } from '@angular/core';
import { JueganService } from './juegan.service';
import { jugadorHabitualModel } from '../models/habituales.model';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {
  
  private juegan$: BehaviorSubject<jugadorHabitualModel[]>= new BehaviorSubject<jugadorHabitualModel[]>([]);
  private noJuegan$: BehaviorSubject<jugadorHabitualModel[]>= new BehaviorSubject<jugadorHabitualModel[]>([]);
/*
  public readonly currentJuegan$: Observable<jugadorHabitualModel[]>= this.juegan$.asObservable();
  public readonly currentNoJuegan$: Observable<jugadorHabitualModel[]>= this.noJuegan$.asObservable();
*/
  constructor(private jueganService: JueganService) 
  { }

  seteoJuegan(juegan: jugadorHabitualModel[]) :void
  {
    this.juegan$.next(juegan);
  }

  seteoNoJuegan(juegan: jugadorHabitualModel[]) :void
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
