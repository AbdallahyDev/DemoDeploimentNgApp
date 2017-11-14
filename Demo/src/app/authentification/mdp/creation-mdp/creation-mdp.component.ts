import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../commun/services/authentification/AuthService';
import { Utilisateur } from '../../../commun/modeles/Utilisateur';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { Observable } from 'rxjs/Rx';
import { constant } from '../../../commun/constants';

@Component({
    selector: 'creation-mdp',
    templateUrl: './creation-mdp.template.html',
    styleUrls: ['./creation-mdp.style.css']
})
export class CreationMotDePasse implements OnInit  {
    private token: string;
    private msgErreur: string;
    private tokenIsValid: boolean;
    private user: Utilisateur;
    private loading: boolean;

    private sub: any;
    constructor(private _router: Router, private route: ActivatedRoute, private authService: AuthService) {
        this.tokenIsValid = false;
        this.user = new Utilisateur();
        this.msgErreur = "";
        this.token = route.snapshot.params['token'];
        this.loading = true;

        this.authService.checkTokenValidity(this.token).subscribe(
            (isValid: boolean) => {
                this.loading = false;
                if (isValid) {
                    this.tokenIsValid = isValid;
                } else {
                    this.msgErreur = "Lien non valide, rapprochez-vous de votre administrateur de compte.";
                }
            },
            (err: any) => {
                this.loading = false;
                this.msgErreur = "Une erreur interne s'est produite";
            }
        );
    }

    @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

    ngOnInit() {
    }
    private _base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
    //ngOnDestroy() {
    //    this.sub.unsubscribe();
    //}
    private activerCompte(): void {
        this.loading = true;
        let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
        this.authService.ActivateAccount(this.user.Login, this.user.mdp).subscribe(
            (isActivated: boolean) => {
                this.loading = false;
                if (isActivated) {
                    this.tokenIsValid = false;
                    this.msgErreur = "Félicitation, vous pouvez dès maintenant accéder à l'application de contrôle de Carte BTP";
                    timer.subscribe((t: number) => { this._router.navigate(['./authentification']) });
                } else {
                    this.msgErreur = "Identifiant inconnu, veuillez saisir de nouveau votre identifiant";
                    timer.subscribe((t: number) => { this.msgErreur=``; });
                }
            },
            (err: any) => {
                this.loading = false;
                this.tokenIsValid = false;
                this.msgErreur = "Une erreur interne s'est produite, veuillez ré-essayer ultérieurement";
            }
        );
    }
}