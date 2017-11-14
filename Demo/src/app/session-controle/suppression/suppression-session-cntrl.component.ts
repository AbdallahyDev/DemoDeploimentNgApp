import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../commun/services/SharedService';

@Component({
    selector: 'suppression-cartes-session',
    templateUrl: './suppression-session-cntrl.template.html',
    styleUrls: ['./suppression-session-cntrl.style.css']
})
export class SuppressionSessionCntrl {
    private reference: string;
    constructor(http: Http, private _sharedService: SharedService, private route: ActivatedRoute) {
        this.reference = route.snapshot.params['reference'];

        var t = 55;
        this._sharedService.emitChange(``);
    }
}