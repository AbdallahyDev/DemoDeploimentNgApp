import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

import { SharedService } from '../../commun/services/SharedService';

@Component({
    selector: 'partage-session-cntrl',
    templateUrl: './partage-session-cntrl.template.html',
    styleUrls: ['./partage-session-cntrl.style.less']
})
export class PartageSessionCntrl {
    constructor(http: Http, private _sharedService: SharedService) {
        this._sharedService.emitChange(``);
    }
}