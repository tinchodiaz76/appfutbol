import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  subscription: Subscription | undefined;

  constructor(public loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  }

  logIn(proveedor: string)
  {
    let partir :any=[];

    console.log(this.activatedRoute.snapshot.queryParams['returnUrl']); 

    console.log('antes de hacer login')
    
    this.loginService.login(proveedor);

    
  }

}
