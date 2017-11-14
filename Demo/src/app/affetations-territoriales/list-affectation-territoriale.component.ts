import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { SharedService } from '../commun/services/SharedService';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonAffTerritorialeActionComponent } from '../affetations-territoriales/boutons-actions/ButtonAffTerritorialeActionComponent';
import { AffectationTerritoriale } from '../commun/modeles/AffectationTerritoriale';
import { AffectationTerritorialeService } from '../commun/services/affectation-territoriale/affectation-territorial-service';
import { AuthService } from '../commun/services/authentification/AuthService';
import { CorpsControleService } from '../commun/services/corps-controle/corps-controle-service';
import { CorpsControle } from '../commun/modeles/CorpsControle';
import { constant } from '../commun/constants';

@Component({
    selector: 'list-affectation-territoriale',
    templateUrl: './list-affectation-territoriale.template.html',
    styleUrls: ['./list-affectation-territoriale.style.css'],
    entryComponents: [ButtonAffTerritorialeActionComponent]

})
export class ListAffectationTerritoriale {
    title = 'app controle';
    test: string = "tester mon app!!";
    listeAffTerritoriale: Array<AffectationTerritoriale>
    settings: any;
    source: LocalDataSource;

    constructor(http: Http, private _sharedService: SharedService, private authService: AuthService,
        private _affectationTerritorialeService: AffectationTerritorialeService, private _corpsControleService: CorpsControleService) {
        this._sharedService.emitChange(` `);
        this.listeAffTerritoriale = [];
        this.mySettings.columns.Libelle.filter.config.completer.data = this.listeAffTerritoriale;
        this.mySettingsWithoutActions.columns.Libelle.filter.config.completer.data = this.listeAffTerritoriale;
        this.settings = Object.assign({}, this.showDeleteButton() ? this.mySettings : this.mySettingsWithoutActions);
        this.source = new LocalDataSource();
        this.source.load(this.listeAffTerritoriale);

        if (this.authService.user.Profil.Code.toUpperCase().includes("UCF")) {
            this._corpsControleService.GetAllCorpsControle().subscribe(
                (data: Array<CorpsControle>) => {
                    this._sharedService.emitListeCorpsCntrlChange(data);
                    this._affectationTerritorialeService.GetAllAffTerritoriale(this.authService.user.ID, data[0].ID).subscribe(
                        (data: Array<AffectationTerritoriale>) => {
                            this.initNg2SmartTableConfig(data);

                        },
                        (err: any) => {
                            this._sharedService.emitChange(`Une erreur interne s'est produite`);
                        }
                    );
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur interne s'est produite`);
                }
            );

        } else {
            this._affectationTerritorialeService.GetAllAffTerritoriale(this.authService.user.ID, this.authService.user.AffectationTerritoriale.CorpsControle.ID).subscribe(
                (data: Array<AffectationTerritoriale>) => {
                    this.initNg2SmartTableConfig(data);
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur s'est produite`);
                }
            );
        }

        this._sharedService.listeATChangeEmitted.subscribe(
            listeHabUpdated => {
                this.source.load(this.buildListeAT(listeHabUpdated));
            });
    }

    private showCreateButton(): boolean {
        // A ne pas afficher si l'utilisateur est un profil contrôleur ou gestionnaire UCF ou ADMNIV2
        return this.authService.user.Profil.Code.toUpperCase().includes("ADMINUCF")
            || this.authService.user.Profil.Code.toUpperCase().includes("ADMINNIV1") ? true : false;
    }

    private showDeleteButton(): boolean {
        // A ne pas afficher si l'utilisateur est un profil contrôleur ou gestionnaire UCF ou ADMINNIV2
        return this.authService.user.Profil.Code.toUpperCase().includes("ADMINUCF")
            || this.authService.user.Profil.Code.toUpperCase().includes("ADMINNIV1") ? true : false;
    }

    /**
     * Méthode pour mettre à jour le nombre de lignes par page
     * @param itemsPerPage: le nombre de lignes voulu par page
     */
    public updateItemsNbrPerPage(itemsPerPage: number): void {
        this.source.setPaging(1, itemsPerPage, true);
    }

    private initNg2SmartTableConfig(data: Array<AffectationTerritoriale>) {
        this.listeAffTerritoriale = this.buildListeAT(data);
        this.mySettings.columns.Libelle.filter.config.completer.data = this.listeAffTerritoriale;
        this.mySettingsWithoutActions.columns.Libelle.filter.config.completer.data = this.listeAffTerritoriale;
        this.settings = Object.assign({}, this.showDeleteButton() ? this.mySettings : this.mySettingsWithoutActions);
        this.source = new LocalDataSource();
        this.source.load(this.listeAffTerritoriale);
    }

    private buildListeAT(l: Array<AffectationTerritoriale>): Array<AffectationTerritoriale> {
        let data: Array<AffectationTerritoriale> = new Array<AffectationTerritoriale>();
        for (let a of l) {
            var at: AffectationTerritoriale = new AffectationTerritoriale();
            at.Libelle = a.Libelle;
            at.ID = a.ID;
            at.CorpsControle = a.CorpsControle;
            at.actions = "";
            data.push(at);
        }
        return data;
    }


    mySettings = {
        columns: {
           
            Libelle: {
                title: 'Affectation Territoriale',
                width: '90%',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listeAffTerritoriale,
                            searchFields: 'Libelle',
                            titleField: 'Libelle',
                            placeholder: ' '
                        },
                    },
                }
            },
            actions: //or something
            {
                title: 'Actions',
                type: 'custom',
                renderComponent: ButtonAffTerritorialeActionComponent,
                filter: false,
                sort: false,
                show: false
            }

        },
        noDataMessage: 'La table des affectations territoriales est vide',
        pager: {
            display: true,
            perPage: constant.NUMBER_ELEMENTS_PER_PAGE
        },
        actions: {
            columnTitle: "Actions",
            add: false,
            delete: false,
            edit: false,
            position: "left"
        }
    }

    mySettingsWithoutActions = {
        columns: {
            Libelle: {
                title: 'Affectation Territoriale',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listeAffTerritoriale,
                            searchFields: 'Libelle',
                            titleField: 'Libelle',
                            placeholder: ' '
                        },
                    },
                }
            }

        },
        noDataMessage: 'La table des affectations territoriales est vide',
        pager: {
            display: true,
            perPage: constant.NUMBER_ELEMENTS_PER_PAGE
        },
        actions: {
            columnTitle: "Actions",
            add: false,
            delete: false,
            edit: false,
            position: "left"
        }
    }
}
