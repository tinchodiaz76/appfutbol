import { Component, OnInit, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
//import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-dialogo-jugador',
  templateUrl: './dialogo-jugador.component.html',
  styleUrls: ['./dialogo-jugador.component.css']
})
export class DialogoJugadorComponent implements OnInit {

  showDiv: boolean=false;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';

  constructor(
    public dialogRef: MatDialogRef<DialogoJugadorComponent>,
    @ Inject(MAT_DIALOG_DATA) public data: any) 
  {

  }

  ngOnInit() {
  }

  cancelar() {
    this.dialogRef.close();
  }

}
