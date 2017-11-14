import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { Utilisateur } from '../../../commun/modeles/Utilisateur'
import { AuthService } from '../../../commun/services/authentification/AuthService'
import { SharedService } from '../../../commun/services/SharedService'
import { constant } from '../../../commun/constants';

@Component({
    selector: 'mot-de-passe-oublie',
    templateUrl: './mdp-oublie.template.html',
    styleUrls: ['./mdp-oublie.style.css']
})
export class MotDePasseOublie implements OnInit {

    private user: Utilisateur;
    private msgErreur: string;
    private loading: boolean;
    constructor(private authService: AuthService, private _sharedService: SharedService, private _router: Router) {
        this.user = new Utilisateur();

    }
    ngOnInit() {
    }

    private envoyer() {
        let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
        this.loading = true;
        this.authService.checkLoginValidity(this.user.Login).subscribe(
            (result: boolean) => {
                this.loading = false;
                if (result) {
                    this.msgErreur = `Un courriel vous a été envoyé pour la réinitialisation de votre mot de passe. Merci de consulter votre messagerie`;
                    timer.subscribe((t: number) => { this.msgErreur = ""; this._router.navigate(['./authentification']); });
                } else {
                    this.msgErreur = `Une erreur est survenue, veuillez ressayer ultérieurement`;
                    timer.subscribe((t: number) => { this.msgErreur = ""; this._router.navigate(['./authentification']); });
                }
            },
            (err: any) => {
                this.loading = false;
                if (err == 'USER_NOTFOUND')
                    this.msgErreur = 'Si l’identifiant est valide, un courriel sera envoyé à l’adresse associée';
                var codeErreur: Array<string> = err.split('|');
                switch (codeErreur[0]) {
                    case 'USER_NOTFOUND':
                        this.msgErreur = 'Si l’identifiant est valide, un courriel sera envoyé à l’adresse associée';
                        break;
                    case 'USER_DESACTIVATED':
                        //var dateFormat: Array<string> = codeErreur[1].split(' ');
                       // var date : Date = new Date(`${dateFormat[0]}/${dateFormat[1]}/${dateFormat[2]}`);
                        //this.msgErreur = `${constant.USER_DESACTIVATED} : ${dateFormat[1]}/${date.getMonth()+1}/${dateFormat[2]}`;
                        this.msgErreur = 'Si l’identifiant est valide, un courriel sera envoyé à l’adresse associée';
                        break;
                    default:
                        this.msgErreur = `Une erreur interne s'est produite`;
                        break;

                }
            }
        );
    }
}