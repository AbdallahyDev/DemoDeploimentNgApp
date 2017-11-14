import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../commun/services/SharedService';

@Component({
    selector: 'creation-affectation-territoriale',
    templateUrl: './creation-affectation-territoriale.template.html',
    styleUrls: ['./creation-affectation-territoriale.style.css']
})
export class CreationAffectationTerritoriale {
    constructor(http: Http, private _sharedService: SharedService, private route: ActivatedRoute, private _router: Router) {
        this._sharedService.emitChange(` `);

    }
    
}