import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionCntrlService } from '../../commun/services/session-controle/session-controle-service';
import { SharedService } from '../../commun/services/SharedService';
import { SessionControle } from '../../commun/modeles/SessionControle';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../commun/services/authentification/AuthService';
import { constant } from '../../commun/constants';


@Component({
    selector: 'creation-session-cntrl',
    templateUrl: './creation-session-cntrl.template.html',
    styleUrls: ['./creation-session-cntrl.style.less']
})
export class CreationSessionCntrl {
    // le message d'erreur à afficher à l'utilisateur 
    private msgErreur: string;
    private showMsg: boolean;
    private loading: boolean;
    private refSessionLength: number;
    private sessionCntrl: SessionControle;
    private nmbrEltPerPage: number;
    constructor(http: Http, private _sharedService: SharedService, private _sessionCntrlService: SessionCntrlService, private authService: AuthService, private _router: Router) {
        this.refSessionLength = constant.REF_SESSION_LENGTH;
        this.sessionCntrl = new SessionControle();
        this.sessionCntrl.DteCreation = new Date();
        this.sessionCntrl.IndEtat = 1;
        this._sharedService.emitChange(``);
        this.showMsg = false;
        this.loading = false;
    }


    private annuler() {
        this._router.navigate(['./sessions']);
    }
    private creerSessionCntrl() {
        // tester si les champs obligatoires ont été remplis ou non
        if ((!this.sessionCntrl.Reference || !this.sessionCntrl.ReferenceChantier || !this.sessionCntrl.AdresseChantier) || (!this.sessionCntrl.Reference.replace(/\s/g, '').length || !this.sessionCntrl.ReferenceChantier.replace(/\s/g, '').length || !this.sessionCntrl.AdresseChantier.replace(/\s/g, '').length
           )) {
            this.msgErreur = `Veuillez remplir tous les champs obligatoires`;
            this.showMsg = true;
            let timer = Observable.timer(4000);
            timer.subscribe((t: number) => this.showMsg = false);
            return;
        } else {
            this.loading = true;
            this._sessionCntrlService.checkExist(this.authService.user.ID, this.sessionCntrl.Reference).subscribe(
                (data: SessionControle) => {
                    if (data === null) {
                        this._sessionCntrlService.creerSessionCntrl(this.sessionCntrl, this.authService.user.ID).subscribe(
                            (result: boolean) => {
                                this.loading = false;
                                if (result) {
                                    this._sharedService.emitChange(`La session a été créée avec succès`);
                                    let timer = Observable.timer(4000);
                                    timer.subscribe((t: number) => { this.annuler(); this._sharedService.emitChange(``); });
                                }
                            },
                            (err: any) => {
                                this.loading = false;
                                this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                                let timer = Observable.timer(4000);
                                timer.subscribe((t: number) => { this.annuler(); this._sharedService.emitChange(``); });
                            }
                        );
                    } else {
                        this.loading = false;
                        this._sharedService.emitChange("Cette référence existe déjà");
                        let timer = Observable.timer(4000);
                        timer.subscribe((t: number) => {  this._sharedService.emitChange(``); });
                    }
                },
                (err: any) => {
                    this.loading = false;
                    this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                    let timer = Observable.timer(4000);
                    timer.subscribe((t: number) => { this.annuler(); this._sharedService.emitChange(``); });
                }
            );
        }

    }
}