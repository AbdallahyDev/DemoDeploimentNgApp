import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
import { SharedService } from '../../services/SharedService';
import { AuthService } from '../../services/authentification/AuthService';

@Component({
  selector: 'headers',
  templateUrl: './header.template.html',
  styleUrls: ['./header.style.css']
})

/**
 * Classe représentant le header de la page
 */
export class Header {


    private afficheMenu: boolean;
    // Flag pour dire à la vue si l'authentification est faite ou pas'
    private isAuthentified: boolean;
    constructor(private _sharedService: SharedService, private authService: AuthService, private router: Router) {
        this.afficheMenu = false;
    }


    /**
     * Méthode pour afficher ou cacher le menu contenat les infos de l'utilisateur dans le coin haut droit de la page
     */
    private basculerMenu(): void {
        this.afficheMenu = !this.afficheMenu;
    }

    private logOut(): void {
        this.authService.logout();
        this.afficheMenu = false;
        this.router.navigate(['/authentification']);
    }

    private getRedirectUrl(): string {
        let redirectURL: string = "/sessions";
        if (this.authService.user !== undefined && this.authService.user.Profil!==undefined && this.authService.user.Profil.Code.toUpperCase().includes("UCF")) {
           redirectURL = "/habilitations";
        }
       return redirectURL;
    }
}
