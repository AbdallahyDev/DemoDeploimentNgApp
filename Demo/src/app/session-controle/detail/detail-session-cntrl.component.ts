import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../commun/services/SharedService';
import { SessionCntrlService } from '../../commun/services/session-controle/session-controle-service';
import { SessionControle } from '../../commun/modeles/SessionControle';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'detail-session-cntrl',
    templateUrl: './detail-session-cntrl.template.html',
    styleUrls: ['./detail-session-cntrl.style.css']
})
export class DetailSessionCntrl {
    private idSession: number;
    private dataHasChanged: boolean;
    private showMsg: boolean;
    private msgErreur: string;
    private sessionCntrl: SessionControle;
    constructor(http: Http, private _sharedService: SharedService, private route: ActivatedRoute, private _sessionCntrlService: SessionCntrlService, private _router: Router) {
        this.idSession = route.snapshot.params['idSession'];
        this._sharedService.emitChange(``);
        this.sessionCntrl = new SessionControle();
        this.dataHasChanged = false;
        this._sessionCntrlService.getSessionCntrlById(this.idSession).subscribe(
            (data: SessionControle) => {
                this.sessionCntrl = data;
                this._sharedService.emitChange("");
            },
            (err: any) => {
                this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
            }
        );
    }

    private annuler() {
        this._router.navigate(['./sessions']);
    }

    private updateSession() {
        if (this.dataHasChanged) {
            if ((!this.sessionCntrl.Reference || !this.sessionCntrl.ReferenceChantier || !this.sessionCntrl.AdresseChantier) || (!this.sessionCntrl.Reference.replace(/\s/g, '').length || !this.sessionCntrl.ReferenceChantier.replace(/\s/g, '').length || !this.sessionCntrl.AdresseChantier.replace(/\s/g, '').length)) {
                this.msgErreur = `Veuillez remplir tous les champs obligatoires`;
                this.showMsg = true;
                let timer = Observable.timer(4000);
                timer.subscribe((t: number) => this.showMsg = false);
                return;
            }
            this._sessionCntrlService.updateSessionCntrl(this.sessionCntrl).subscribe(
                (data: boolean) => {
                    this._sharedService.emitChange(`La session a été bien mise à jour`)
                    let timer = Observable.timer(4000);
                    timer.subscribe((t: number) => { this._sharedService.emitChange(``); this.annuler(); });
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                }
            );
        } else {
            this.annuler();
        }
    }
}