import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../commun/services/SharedService';

@Component({
    selector: 'cloture-session-cntrl',
    templateUrl: './cloture-session-cntrl.template.html',
    styleUrls: ['./cloture-session-cntrl.style.css']
})
export class ClotureSessionCntrl {
    private reference: string;
    constructor(http: Http, private _sharedService: SharedService, private route: ActivatedRoute) {
        this.reference = route.snapshot.params['reference'];
        this._sharedService.emitChange(`Msg from cloture session cntrl`);
    }
}