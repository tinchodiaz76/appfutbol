export class jugadorHabitualModel{
    id?:string;
    nombre?: string;
    juega: boolean;
    habitual: boolean;
    activo: boolean;

    constructor(){
        this.activo=true;
        this.habitual=true;
        this.juega=false;
    }
}

