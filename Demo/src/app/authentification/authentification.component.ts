import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from '../commun/services/authentification/AuthService';
import { SharedService } from '../commun/services/SharedService';
import { UserAuthentification } from '../commun/modeles/UserAuthentification';
import { Utilisateur } from '../commun/modeles/Utilisateur';
import { constant } from '../commun/constants';
import { ViewChild } from '@angular/core';
@Component({
    selector: 'authentification',
    templateUrl: './authentification.template.html',
    styleUrls: ['./authentification.style.css']
})
export class Authentification implements OnInit {
    // reponse Captcha
    // le message d'erreur à afficher à l'utilisateur 
    msgErreur: string;

    // varibale gérant l'authentificatrion d'un utilisateur
    user: UserAuthentification;
    // variable servant à afficher le chargement en cas d'appel au serveur
    loading: boolean;

    ngOnInit() {
        this.user = new UserAuthentification();
        this.loading = false;
        this.msgErreur = "";
    }


    private authentifier(bol: boolean): void {

        alert("juste avant le déclenchement de l'event");
        this._sharedService.emitChange(`Data from child: ${bol}`);

        // this.onAuthentifier.emit(bol);
        alert("juste après le déclenchement de l'event");
    }

    message: string;

    constructor(private _sharedService: SharedService, private authService: AuthService, private router: Router) {
        this.setMessage();
    }

    setMessage() {
        this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
    }

    login(): void {
        if (this.user.password === "" || this.user.username === "") {
            this.msgErreur = 'Les deux champs sont obligatoires';
            return;
        } else {
            this.loading = true;
            this.authService.authentifier(this.user.username, this.user.password).subscribe(
                (user: Utilisateur) => {
                    this.authService.isLoggedIn = true;
                    this.authService.user = user;
                    // Get the redirect URL from our auth service
                    // If no redirect has been set, use the default
                    let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : this.authService.user.Profil.Code.toUpperCase().includes("UCF") ?"/habilitations":'/sessions';
                    // Redirect the user
                    this.router.navigate([redirect]);
                    this.loading = false;
                },
                (err:any) => {
                    this.loading = false;
                    var codeErreur: Array<string> = err.split('|');
                    switch (codeErreur[0]) {
                        case 'USER_NOTFOUND':
                            this.msgErreur = constant.USER_NOTFOUND;
                            break;
                        case 'USER_DESACTIVATED':
                            this.msgErreur = `${constant.USER_DESACTIVATED} : ${codeErreur[1]}`;
                            break;
                        case 'USER_PWDNOMATCH':
                            this.msgErreur = `${constant.USER_PWDNOMATCH}, il vous reste ${codeErreur[1]} tentatives`;
                            break;
                        case 'USER_PWDEXPIRED':
                            this.msgErreur = `${constant.USER_PWDEXPIRED} le ${codeErreur[1]} , cliquer ici pour créer un nouveau mot de passe`;
                            break;
                        case 'USER_BLOCKED': 
                            this.msgErreur = `${constant.USER_BLOCKED}. Le compte a été bloqué pour une durée de  ${codeErreur[1].length > 1 ? 'minutes' :'minute'} `;
                            break;
                        case 'USER_BLOCKED_TIME_STAYING': 
                            this.msgErreur = `${constant.USER_BLOCKED_TIME_STAYING}  ${codeErreur[1].length > 1 ? 'minutes' : 'minute'}`;
                            break;
                        default:
                            this.msgErreur = `Une erreur interne s'est produite`;
                            break;
                    }
                }
            );

        }


    }

    logout() {
        this.authService.logout();
        this.setMessage();
    }
}
