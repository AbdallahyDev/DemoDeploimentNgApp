import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { SharedService } from '../commun/services/SharedService';
import { Utilisateur } from '../commun/modeles/Utilisateur';
import { UtilisateurHelper } from '../commun/modeles/UtilisateurHelper';
import { ButtonHabilationActionComponent } from '../habilitations/boutons-actions/button-habilation-action';
import { constant } from '../commun/constants';
import { HabilitationService } from '../commun/services/habilitation/habilitation-service';
import { AuthService } from '../commun/services/authentification/AuthService';
import { DomSanitizer } from '@angular/platform-browser';
import { CorpsControleService } from '../commun/services/corps-controle/corps-controle-service';
import { CorpsControle } from '../commun/modeles/CorpsControle';
@Component({
    selector: 'liste-habilitation',
    templateUrl: './liste-habilitation.template.html',
    styleUrls: ['./liste-habilitation.style.css'],
    entryComponents: [ButtonHabilationActionComponent]
})
export class ListeHabilitation {

    private listeUtilisateurs: Array<UtilisateurHelper>;
    settings: any;
    source: LocalDataSource;

    constructor(http: Http, private _sharedService: SharedService, private _habService: HabilitationService, private _sanitizer: DomSanitizer,
        private authService: AuthService, private _corpsControleService: CorpsControleService) {
        this._sharedService.emitChange(` `);
        this.listeUtilisateurs = [];
        this.mySettings.columns.Nom.filter.config.completer.data = this.listeUtilisateurs;
        this.mySettings.columns.Prenom.filter.config.completer.data = this.listeUtilisateurs;
        this.mySettings.columns.AffectationTerritoriale.filter.config.completer.data = this.listeUtilisateurs;
        this.settings = Object.assign({}, this.mySettings);
        this.source = new LocalDataSource();
        this.source.load(this.listeUtilisateurs);
        if (this.authService.user.Profil.Code.toUpperCase().includes("UCF")) {
            this._corpsControleService.GetAllCorpsControle().subscribe(
                (data: Array<CorpsControle>) => {
                    this._sharedService.emitListeCorpsCntrlChange(data);
                    this._habService.GetAllHabByUserId(this.authService.user.ID, data[0].ID).subscribe(
                        (data: Array<Utilisateur>) => {
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
            this._habService.GetAllHabByUserId(this.authService.user.ID, this.authService.user.AffectationTerritoriale.CorpsControle.ID).subscribe(
                (data: Array<Utilisateur>) => {
                    this.initNg2SmartTableConfig(data);
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur interne s'est produite`);
                }
            );
        }



        _sharedService.listeHabilitationChangeEmitted.subscribe(
            listeHabUpdated => {
                this.source.load(this.buildHabilitationListe(listeHabUpdated));
            });
    }

    private initNg2SmartTableConfig(data: Array<Utilisateur>) {
        this.listeUtilisateurs = this.buildHabilitationListe(data);
        this.mySettings.columns.Nom.filter.config.completer.data = this.listeUtilisateurs;
        this.mySettings.columns.Prenom.filter.config.completer.data = this.listeUtilisateurs;
        this.mySettings.columns.AffectationTerritoriale.filter.config.completer.data = this.listeUtilisateurs;
        this.settings = Object.assign({}, this.mySettings);
        this.source = new LocalDataSource();
        this.source.load(this.listeUtilisateurs);
    }

    private getIdCorpsControleToFind(): number {
        return this.authService.user.Profil.Code.toUpperCase().includes("UCF") ? 0 : this.authService.user.AffectationTerritoriale.CorpsControle.ID;
    }

    private buildHabilitationListe(l: Array<Utilisateur>): Array<UtilisateurHelper> {
        let data: Array<UtilisateurHelper> = new Array<UtilisateurHelper>();
        for (let u of l) {
            var user: UtilisateurHelper = new UtilisateurHelper();
            user.ID = u.ID;
            user.Nom = u.Nom;
            user.Prenom = u.Prenom;
            user.AffectationTerritoriale = u.AffectationTerritoriale ? u.AffectationTerritoriale.Libelle : '';
            user.Profil = u.Profil.Libelle;
            user.Statut = u.IndStatut == 1 ? "Actif" : u.IndStatut == 0 ? "InActif" : "En attente activation";
            user.actions = "";
            data.push(user);
        }
        return data;
    }

    /**
     * Méthode pour mettre à jour le nombre de lignes par page
     * @param itemsPerPage: le nombre de lignes voulu par page
     */
    public updateItemsNbrPerPage(itemsPerPage: number): void {
        this.source.setPaging(1, itemsPerPage, true);
    }

    Data = [
        {
            Nom: "Test Nom",
            Prenom: "Test prenom",
            AffectationTerritoriale: "test AT",
            Profil: "Administrateur niv. 1",
            Statut: "Actif",
            actions: "Actif"
        },
        {
            Nom: "Test Nom2",
            Prenom: "Test prenom2",
            AffectationTerritoriale: "test AT2",
            Profil: "Administrateur niv. 2",
            Statut: "En attente activation",
            actions: "En attente activation"
        },
        {
            Nom: "Messi",
            Prenom: "Leo",
            AffectationTerritoriale: "paris",
            Profil: "Administrateur UCF",
            Statut: "Inactif",
            actions: "Inactif"
        }
    ]

    mySettings = {
        columns: {
            Nom: {
                title: 'Nom',
                width: '18%',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listeUtilisateurs,
                            searchFields: 'Nom',
                            titleField: 'Nom',
                            placeholder: ' '
                        },
                    },
                }
            },
            Prenom: {
                title: `Prenom`,
                mode: 'inline',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listeUtilisateurs,
                            searchFields: 'Prenom',
                            titleField: 'Prenom',
                            placeholder: ' '
                        },
                    },
                }
            },
            AffectationTerritoriale: {
                title: 'Affectation territoriale',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listeUtilisateurs,
                            searchFields: 'AffectationTerritoriale',
                            titleField: 'AffectationTerritoriale',
                            placeholder: 'Tous'
                        },
                    },
                }
            },
            Profil: {
                title: 'Profil',
                filter: {
                    type: 'list',
                    config: {
                        selectText: '',
                        list: [
                            { value: 'Administrateur de niveau 1', title: 'Administrateur de niveau 1' },
                            { value: 'Administrateur de niveau 2', title: 'Administrateur de niveau 2' },
                            { value: 'Administrateur UCF', title: 'Administrateur UCF' },
                            { value: 'Gestionnaire UCF', title: 'Gestionnaire UCF' },
                            { value: 'Contr\u00f4leur', title: 'Contr\u00f4leur' }
                        ],
                    },
                },
            },
            Statut: {
                title: 'Statut',
                filter: {
                    type: 'list',
                    config: {
                        selectText: '',
                        list: [
                            { value: 'En attente activation', title: 'En attente activation' },
                            { value: 'Actif', title: 'Actif' },
                            { value: 'Inactif', title: 'Inactif' }
                        ],
                    },
                },
                filterFunction: this.customFilterStatutFunction
            },

            actions: //or something
            {
                title: 'Actions',
                type: 'custom',
                width: '15%',
                renderComponent: ButtonHabilationActionComponent,
                filter: false,
                sort: false
            }
        },
        noDataMessage: 'La table des habilitations est vide',
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
        },
    };

    // Surcharge de la méthode de filtrage des lignes
    private customFilterStatutFunction(cell?: any, search?: string): boolean {
        if (search === cell || search === '') {
            return true;
        } else {
            return false;
        }
    }

    private showCreateButton(): boolean {
        // A ne pas afficher si l'utilisateur est un profil contrôleur ou gestionnaire UCF
        return this.authService.user.Profil.Code.toUpperCase().includes("ADMINUCF") || this.authService.user.Profil.Code.toUpperCase().includes("ADMINNIV1")
            || this.authService.user.Profil.Code.toUpperCase().includes("ADMINNIV2") ? true : false;
    }

    /**
    * Méthode pour gérer la sélection/désélection d'une ligne de la table
    * @param e : objet contenant l'objet sélectionné et la liste de données 
    */
    private onChkSelectionClick(e: any): void {
        //var session: SessionHelper = new SessionHelper();
        //if (e.data === null) {
        //    this.selectAll = !this.selectAll;
        //    if (this.selectAll) {
        //        this.checkedEltList = e.source.data;
        //    } else {
        //        this.checkedEltList = [];
        //    }
        //} else {
        //    session = session.copy(e.data);
        //    if (e.data.selection === false) {
        //        this.checkedEltList.push(session);
        //    } else {
        //        this.checkedEltList = this.checkedEltList.filter(s => s.id !== e.data.id);
        //    }
        //    e.data.selection = !e.data.selection;
        //}
    }
}
