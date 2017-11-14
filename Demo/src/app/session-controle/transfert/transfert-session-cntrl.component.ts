import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

import { SharedService } from '../../commun/services/SharedService';
@Component({
    selector: 'transfert-session-cntrl',
    templateUrl: './transfert-session-cntrl.template.html',
    styleUrls: ['./transfert-session-cntrl.style.less']
})
export class TransfertSessionCntrl {
    constructor(http: Http, private _sharedService: SharedService) {
        this._sharedService.emitChange(` `);
    }
}