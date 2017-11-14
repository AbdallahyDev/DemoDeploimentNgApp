import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { SharedService } from '../commun/services/SharedService';
import { SessionCntrlService } from '../commun/services/session-controle/session-controle-service';
import { SessionHelper } from '../commun/modeles/SessionHelper';
import { SessionControle } from '../commun/modeles/SessionControle'
import { ButtonSessionActionComponent } from '../session-controle/boutons-actions/bouton-action.component';
import { AuthService } from '../commun/services/authentification/AuthService';
import { constant } from '../commun/constants';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'session-cntrl',
    templateUrl: './session-cntrl.template.html',
    styleUrls: ['./session-cntrl.style.css'],
    entryComponents: [ButtonSessionActionComponent]
})
export class SessionCntrl {
    urlImg: string = "img/CIP2016_-_COM_-_Logo Web.png";
    public checkBoxInput: string = '<input type="checkbox"></input>';


    settings: any;
    source: LocalDataSource;
    checkedEltList: Array<SessionHelper>;
    sessionCntrlList: Array<SessionHelper>;
    constructor(http: Http, private _sharedService: SharedService, private _sessionCntrlService: SessionCntrlService,
        private authService: AuthService, private _sanitizer: DomSanitizer, private _router: Router) {
        this.checkedEltList = new Array<SessionHelper>();
        this.sessionCntrlList = [];
        this.mySettings.columns.reference.filter.config.completer.data = this.sessionCntrlList;
        this.mySettings.columns.idChantier.filter.config.completer.data = this.sessionCntrlList;
        this.mySettings.columns.date.filter.config.completer.data = this.sessionCntrlList;
        this.settings = Object.assign({}, this.mySettings);
        this.source = new LocalDataSource();
        this.source.load(this.sessionCntrlList);
        let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);

        this._sessionCntrlService.GetAllSessionCntrlByUserId(this.authService.user.ID).subscribe(
            (data: Array<SessionControle>) => {
                this.sessionCntrlList = this.buildSessionCntrlList(data);
                this.mySettings.columns.reference.filter.config.completer.data = this.sessionCntrlList;
                this.mySettings.columns.idChantier.filter.config.completer.data = this.sessionCntrlList;
                this.mySettings.columns.date.filter.config.completer.data = this.sessionCntrlList;
                this.settings = Object.assign({}, this.mySettings);
                this.source = new LocalDataSource();
                this.source.load(this.sessionCntrlList);
                this.sessionCntrlList.length > 0 ? this._sharedService.emitChange(``) : this._sharedService.emitChange(`Aucune session de contrôle liée à votre compte`);
                timer.subscribe((t: number) => { this._sharedService.emitChange(``); });
            },
            (err: any) => {
                this._sharedService.emitChange(`Une erreur interne s'est produite`);
                timer.subscribe((t: number) => { this._sharedService.emitChange(``); });
            }
        );
    }

    private buildSessionCntrlList(l: Array<SessionControle>): Array<SessionHelper> {
        let data: Array<SessionHelper> = new Array<SessionHelper>();
        for (var s of l) {
            var session: SessionHelper = new SessionHelper();
            session.id = s.ID;
            session.actions = s.IndEtat === 1 ? 'En cours' : 'Clôturée';
            session.date = this.formateDate(s.DteCreation);
            session.etat = session.actions;
            session.reference = s.Reference;
            session.idChantier = s.ReferenceChantier;
            session.selection = false;
            data.push(session);
        }
        return data;
    }

    private formateDate(date: Date): string {
        return date !== null ? date.toString().split("T")[0].split("-").reverse().join("/") : "";
    }

    /**
     * Méthode pour mettre à jour le nombre de lignes par page
     * @param itemsPerPage: le nombre de lignes voulu par page
     */
    public updateItemsNbrPerPage(itemsPerPage: number): void {
        this.source.setPaging(1, itemsPerPage, true);
    }

    private redirectTo(pageName: string) {
        this._router.navigate(['./habilitations']);
    }

    private checkDisabled(): boolean {
        return this.checkedEltList.length === 0;
    }

    mySettings = {
        columns: {
            date: {
                title: 'Date',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.sessionCntrlList,
                            searchFields: 'date',
                            titleField: 'date',
                            placeholder: 'Date'
                        },
                    },
                }
            },
            reference: {
                title: 'Référence',
                mode: 'inline',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.sessionCntrlList,
                            searchFields: 'reference',
                            titleField: 'reference',
                            placeholder: 'Référence'
                        },
                    },
                }
            },
            idChantier: {
                title: 'Identifiant du chantier',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.sessionCntrlList,
                            searchFields: 'idChantier',
                            titleField: 'idChantier',
                            placeholder: 'Identifiant du chantier'
                        },
                    },
                }
            },
            etat: {
                title: 'Etat',
                filter: {
                    type: 'list',
                    config: {
                        selectText: '',
                        list: [
                            { value: 'En cours', title: 'En cours' },
                            { value: 'Clôturée', title: 'Clôturée' }
                        ],
                    },
                },
            },
            actions: //or something
            {
                title: 'Actions',
                type: 'custom',
                renderComponent: ButtonSessionActionComponent,
                filter: false,
                sort: false
            }
        },
        selectMode: 'multi', //to add multi row check box's
        noDataMessage: 'La table de sessions de contrôle est vide',
        pager: {
            display: true,
            perPage: constant.NUMBER_ELEMENTS_PER_PAGE
        },
        actions: {
            columnTitle: "Actions",
            add: false,
            delete: false,
            edit: false,
            position: "right"
        }
    };

    /**
     * Méthode pour gérer la sélection/désélection d'une ligne de la table
     * @param e : objet contenant l'objet sélectionné et la liste de données 
     */
    private onChkSelectionClick(e: any): void {
        var session: SessionHelper = new SessionHelper();
        if (e.data === null) {
            this.selectAll = !this.selectAll;
            if (this.selectAll) {
                this.checkedEltList = e.source.data;
            } else {
                this.checkedEltList = [];
            }
        } else {
            session = session.copy(e.data);
            if (e.data.selection === false) {
                this.checkedEltList.push(session);
            } else {
                this.checkedEltList = this.checkedEltList.filter(s => s.id !== e.data.id);
            }
            e.data.selection = !e.data.selection;
        }
    }

    /**
     * Méthode pour gérer le click d'un bouton de la colonne action
     * @param e:objet contenant l'objet sélectionné et la liste de données
     */
    private onRowClick(e: any) {
        var t = e.data;
    }

    private selectAll: boolean = false;

    private getClass(): string {
        var reightClass: string = 'bouton bouton-bleu custom-bouton-session-cntrl';
        //if (this.detectIE()!=false) {
        //    reightClass = "bouton bouton-bleu custom-bouton-session-cntrl";
        //}
        //else {
        //    reightClass = "bouton bouton-bleu custom-bouton-session-cntrl";
        //}

        if (this.checkDisabled) {
            reightClass = reightClass + ' custom-disabled';
        }
        return reightClass;
    }

    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
    */
    private detectIE(): any {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }
}
