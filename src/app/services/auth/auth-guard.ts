import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree  } from "@angular/router";
import { LoginService } from "../login.service";
import { AlertasService } from "../alertas.service";

@Injectable({
        providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor( private router: Router,
        private loginService: LoginService,
        private alertaService: AlertasService)
    {}
                
    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): any
    {
        if (this.loginService.isLoggedIn !==true)
        {
            this.alertaService.mostratSwettAlert('Atencion', 'No estas logueado!', 'error');

            console.log('returnUrl:state.url=', state.url);
            return this.router.navigate(['/'],{queryParams:{returnUrl:state.url}}).then(() => false);
        }
        else
        {
            return true;
        }

    }

}
