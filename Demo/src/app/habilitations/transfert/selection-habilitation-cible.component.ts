import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../commun/services/SharedService';

@Component({
    selector: 'selection-habilitation-cible',
    templateUrl: './selection-habilitation-cible.template.html',
    styleUrls: ['./selection-habilitation-cible.style.css']
})
export class SelectionHabilitationCible {
    private idHab: number;
    constructor(http: Http, private _sharedService: SharedService, private route: ActivatedRoute) {
        this.idHab = route.snapshot.params['idHab'];
        this._sharedService.emitChange(` `);
    }
}