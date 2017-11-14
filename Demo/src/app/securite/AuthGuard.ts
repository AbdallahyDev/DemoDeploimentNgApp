import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../commun/services/authentification/AuthService';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.authService.isLoggedIn && this.checkHasDroit(url)) { this.router.navigate([this.router.url]); this.authService.redirectUrl = this.router.url; return false; }
        if (this.authService.isLoggedIn) { return true; }

        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;

        // Navigate to the login page with extras
        this.router.navigate(['/authentification']);
        return false;
    }

    private checkHasDroit(url: string): boolean {
        if (url.includes("session") && this.authService.user.Profil.Code.includes("UCF")) {
            return true;
        }
        return false;
    }
}