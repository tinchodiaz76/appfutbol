export interface jugadorHabitualModel{
    //id:string;
    //idGrupo:number;
    id: string;
    idGrupo:string;
    nombre: string;
    juega: boolean;
    habitual: boolean;
    activo: boolean;
    email: string;
//    fechaCreacion: Date;
    fechaActualizacion: Date;
    readonly: boolean;

}