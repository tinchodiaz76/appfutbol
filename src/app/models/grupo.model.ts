import { Time } from "@angular/common";

export interface grupoModel{
    nombre: string;
    cantIntegrantes: number;
    fechaCreacion?:Date;
    dia: number;
    direccion: string;
    hora: Time;
    precio: number;
    fechaProximoPartido: string;
    juegaTorneo: boolean;
    mail: string;
}

