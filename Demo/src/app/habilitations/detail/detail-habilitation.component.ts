import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../commun/services/SharedService';
import { SessionCntrlService } from '../../commun/services/session-controle/session-controle-service';
import { SessionControle } from '../../commun/modeles/SessionControle';

@Component({
    selector: 'detail-habilitation',
    templateUrl: './detail-habilitation.template.html',
    styleUrls: ['./detail-habilitation.style.css']
})
export class DetailHabilitation {
    private idHabilitation: number;
    private dataHasChanged: boolean;
    private sessionCntrl: SessionControle;
    constructor(http: Http, private _sharedService: SharedService, private route: ActivatedRoute, private _sessionCntrlService: SessionCntrlService, private _router: Router) {
        this.idHabilitation = route.snapshot.params['idHab'];
        this._sharedService.emitChange(``);
        this.sessionCntrl = new SessionControle();
        this.dataHasChanged = false;
        //this._sessionCntrlService.getSessionCntrlById(this.idSession).subscribe(
        //    (data: SessionControle) => {
        //        this.sessionCntrl = data;
        //        this._sharedService.emitChange("");
        //    },
        //    (err: any) => {
        //        this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
        //    }
        //);
    }

    private annuler() {
        this._router.navigate(['./habilitations']);
    }

    private updateSession() {
        if (this.dataHasChanged) {
            this._sessionCntrlService.updateSessionCntrl(this.sessionCntrl).subscribe(
                (data: boolean) => {
                    this.annuler();
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