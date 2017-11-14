import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../commun/services/SharedService';

@Component({
    selector: 'recherche-cartes',
    templateUrl: './recherche-cartes.template.html',
    styleUrls: ['./recherche-cartes.style.css']
})
export class RechercheCarteComponent {
    private reference: string;
    constructor(http: Http, private _sharedService: SharedService, private route: ActivatedRoute) {
        this.reference = route.snapshot.params['reference'];
        this._sharedService.emitChange(` `);
    }
}