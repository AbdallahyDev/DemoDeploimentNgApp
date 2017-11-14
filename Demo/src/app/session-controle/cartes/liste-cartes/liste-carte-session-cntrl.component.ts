import { Component, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../commun/services/SharedService';
import { SessionCntrlService } from '../../../commun/services/session-controle/session-controle-service';
import { SessionControle } from '../../../commun/modeles/SessionControle';
import { Carte } from '../../../commun/modeles/Carte';
import { CarteHelper } from '../../../commun/modeles/CarteHelper';
import { EnumMotifInvalidite } from '../../../commun/enums/EnumMotifInvalidite';
import { EnumPopulationSalarie } from '../../../commun/enums/EnumPopulationSalarie';
import { constant } from '../../../commun/constants';
import { AuthService } from '../../../commun/services/authentification/AuthService';

@Component({
    selector: 'liste-cartes-session',
    templateUrl: './liste-carte-session-cntrl.template.html',
    styleUrls: ['./liste-carte-session-cntrl.style.css']
})
export class ListeCartesSessionCntrl {
    private reference: string;
    private sessionCntrl: SessionControle;
    settings: any;
    private msgConfirmation: string;
    private loading: boolean;
    private showAddedIcon: boolean;
    source: LocalDataSource;
    checkedEltList: Array<CarteHelper>;
    listCartes: Array<CarteHelper> = [];
    listMotifValides: Array<string> = ['EnAttenteDeProd', 'EnProduction', 'Envoyee', 'Delivree', 'NonDelivree'];
    listMotifInvalides: Array<string> = ['Perdue', 'RejeteeParIN', 'AbandonneeParIN', 'Volee', 'Deterioree', 'DemandeAutoritesCompetentes', 'FinPeriodeValidite', 'Traite', 'Deces', 'FinContratTravail', 'PhotoInvalidee'];
    constructor(private authService: AuthService, http: Http, private _sharedService: SharedService, private route: ActivatedRoute, private _sessionCntrlService: SessionCntrlService, private _router: Router) {
        this.sessionCntrl = new SessionControle();
        this.loading = false;
        this.showAddedIcon = false;
        this.sessionCntrl.ID = route.snapshot.params['idSession'];
        this.checkedEltList = [];
        this.listCartes = [];
        this.msgConfirmation = "";
        this.settings = Object.assign({}, this.mySettings);
        this.source = new LocalDataSource();
        this.source.load(this.listCartes);
        this._sessionCntrlService.getSessionCntrlById(this.sessionCntrl.ID).subscribe(
            (data: SessionControle) => {
                this.sessionCntrl = data;
                this._sharedService.emitChange("");
                this._sessionCntrlService.getListeCartesSessionCntrl(this.sessionCntrl.ID).subscribe(
                    (data: Array<Carte>) => {
                        this.listCartes = this.buildListeCartes(data);
                        this.setTableConfig();
                        this.source = new LocalDataSource();
                        this.source.load(this.listCartes);
                        this._sharedService.emitChange(``);
                        //this.listCartes.length > 0 ? this._sharedService.emitChange(``) : this._sharedService.emitChange(`Aucune session de contrôle liée à votre compte`);
                    },
                    (err: any) => {
                        this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                    }
                );
            },
            (err: any) => {
                this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
            }
        );
    }

    @ViewChild('modalConfirmationSuppression')
    modal: ModalComponent;

    private confirmerSuppressionCartes() {
        this.msgConfirmation = this.checkedEltList.length === 1 ? "Souhaitez-vous définitivement supprimer la carte de cette session ?" : "Souhaitez-vous définitivement supprimer les cartes de cette session ?"
        this.modal.open();
    }


    private supprimerCartes() {
        this.modal.close();
        let listeIDCartesToDelete: Array<number> = new Array<number>();
        for (var c of this.checkedEltList) {
            listeIDCartesToDelete.push(c.id);
        }
        let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
        this._sessionCntrlService.supprimerCartesSessionCntrl(listeIDCartesToDelete, this.sessionCntrl.ID).subscribe(
            (data: boolean) => {
                if (data) {
                    this.updateListeCarte();
                    listeIDCartesToDelete.length == 1 ? this._sharedService.emitChange(`La carte sélectionnée a été supprimée de la session de contrôle`) : this._sharedService.emitChange(`Les cartes sélectionnées ont été supprimées de la session de contrôle`);
                    timer.subscribe((t: number) => { this._sharedService.emitChange(``) });
                }
            },
            (err: any) => {
                this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                timer.subscribe((t: number) => { this._sharedService.emitChange(``) });
            }
        );
    }

    private updateListeCarte() {
        for (var carte of this.checkedEltList) {
            this.listCartes = this.listCartes.filter(c => c.id !== carte.id);
        }
        this.checkedEltList = [];
        this.source.load(this.listCartes);
    }

    private buildListeCartes(l: Array<Carte>) {
        let data: Array<CarteHelper> = new Array<CarteHelper>();
        for (var c of l) {
            var carteHelper: CarteHelper = new CarteHelper();
            carteHelper.id = c.ID;
            carteHelper.indStatut = c.IndStatut;
            carteHelper.status = c.IndValide === 0 ? 'Invalide' : 'Valide';
            carteHelper.nom = c.NomUsage;
            carteHelper.prenom = c.Prenom1;
            carteHelper.neLe = c.NaissanceJour + "/" + c.NaissanceMois + "/" + c.NaissanceAnnee;
            carteHelper.population = EnumPopulationSalarie[c.Population];
            carteHelper.numCarte = this.pad(c.NumCarte.toString());
            carteHelper.numCarteFormate = this.formatNumCarte(c.NumCarte.toString());
            carteHelper.delivreeLe = this.formateDate(c.DelivreLe);
            carteHelper.motifInvalidite = carteHelper.status === 'Valide' ? '' : EnumMotifInvalidite[c.MotifInvalidite];
            carteHelper.signalee = carteHelper.status === 'Valide' ? 'Non' : 'Oui';
            carteHelper.selection = false;
            data.push(carteHelper);
        }
        return data;
    }

    private addCarteToListeCartes(c: Carte): boolean {
        if (this.listCartes.findIndex(e => e.id == c.ID) > -1) {
            return false;
        } else {
            var carteHelper: CarteHelper = new CarteHelper();
            carteHelper.id = c.ID;
            carteHelper.indStatut = c.IndStatut;
            carteHelper.status = c.IndValide === 0 ? 'Invalide' : 'Valide';
            carteHelper.nom = c.NomUsage;
            carteHelper.prenom = c.Prenom1;
            carteHelper.neLe = c.NaissanceJour + "/" + c.NaissanceMois + "/" + c.NaissanceAnnee;
            carteHelper.population = EnumPopulationSalarie[c.Population];
            carteHelper.numCarte = this.pad(c.NumCarte.toString());
            carteHelper.numCarteFormate = this.formatNumCarte(c.NumCarte.toString());
            carteHelper.delivreeLe = this.formateDate(c.DelivreLe);
            carteHelper.motifInvalidite = carteHelper.status === 'Valide' ? '' : EnumMotifInvalidite[c.MotifInvalidite];
            carteHelper.signalee = carteHelper.status === 'Valide' ? 'Non' : 'Oui';
            carteHelper.selection = false;
            this.setTableConfig();
            this.listCartes.unshift(carteHelper);
            this.source.load(this.listCartes);
            return true;
        }

    }

    private setTableConfig() {
        this.mySettings.columns.delivreeLe.filter.config.completer.data = this.listCartes;
        this.mySettings.columns.neLe.filter.config.completer.data = this.listCartes;
        this.mySettings.columns.nom.filter.config.completer.data = this.listCartes;
        this.mySettings.columns.numCarte.filter.config.completer.data = this.listCartes;
        this.mySettings.columns.prenom.filter.config.completer.data = this.listCartes;
        this.settings = Object.assign({}, this.mySettings);
    }


    private formatNumCarte(numCarteStr: string): string {
        var res = "";
        if (numCarteStr.length > 0) {
            res = numCarteStr.substring(0, 3) + " " + numCarteStr.substring(3, 6) + " " + numCarteStr.substring(6, 9) + " " + numCarteStr[numCarteStr.length - 1]
        }
        return res;
    }

    private pad(n: number | string, width: number = 10, z: string = ''): string {
        z = z || '0';
        let nStr = n + '';
        return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join(z) + nStr;
    }
    private exporterCartes() {
        alert("export marche!")
    }

    private imprimerCartes() {
        alert("impression lancée!")
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



    private checkDisabled(): boolean {
        return this.checkedEltList.length === 0;
    }

    mySettings = {
        columns: {
            nom: {
                title: 'Nom du salarié',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listCartes,
                            searchFields: 'nom',
                            titleField: 'nom',
                            placeholder: 'Nom'
                        },
                    },
                }
            },
            prenom: {
                title: 'Prénom(s)',
                mode: 'inline',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listCartes,
                            searchFields: 'prenom',
                            titleField: 'prenom',
                            placeholder: 'Prénom'
                        },
                    },
                }
            },
            neLe: {
                title: 'Né(e) le',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listCartes,
                            searchFields: 'neLe',
                            titleField: 'neLe',
                            placeholder: 'Date'
                        },
                    },
                }
            },
            population: {
                title: 'Population',
                filter: {
                    type: 'list',
                    config: {
                        selectText: '',
                        list: [
                            { value: 'Détaché', title: 'Détaché' },
                            { value: 'Intérimaire', title: 'Intérimaire' },
                            { value: 'Interimaire Détaché', title: 'Interimaire Détaché' },
                            { value: 'Salarié', title: 'Salarié' },
                            { value: 'Salarié Détaché', title: 'Salarié Détaché' }
                        ],
                    },
                },
            },
            numCarte: {
                title: 'Carte n°',
                valuePrepareFunction: (value: any) => { return this.formatNumCarte(value) },
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listCartes,
                            searchFields: 'numCarte',
                            titleField: 'numCarte',
                            placeholder: 'Carte n°'
                        },
                    },
                }
            },
            delivreeLe: {
                title: 'Délivrée le',
                filter: {
                    type: 'completer',
                    config: {
                        completer: {
                            data: this.listCartes,
                            searchFields: 'delivreeLe',
                            titleField: 'delivreeLe',
                            placeholder: 'Date'
                        },
                    },
                }
            },
            status: {
                title: 'Statut',
                filter: {
                    type: 'list',
                    config: {
                        selectText: '',
                        list: [
                            { value: 'Valide', title: 'Valide' },
                            { value: 'Invalide', title: 'Invalide' }
                        ],
                    },
                },
                filterFunction: this.customFilterStatutFunction
            },
            motifInvalidite: {
                title: 'Motif invalidité',
                filter: {
                    type: 'list',
                    config: {
                        selectText: '',
                        list: [
                            { value: 'Perdue', title: 'Perdue' },
                            { value: 'Rejetée par IN', title: 'Rejetée par IN' },
                            { value: 'Abandonnée par IN', title: 'Abandonnée par IN' },
                            { value: 'Volée', title: 'Volée' },
                            { value: 'Deteriorée', title: 'Deteriorée' },
                            { value: 'Demande Autorités Compétentes', title: 'Demande Autorités Compétentes' },
                            { value: 'Fin de periode de validité', title: 'Fin de periode de validité' },
                            { value: 'Traitée', title: 'Traitée' },
                            { value: 'Décès', title: 'Décès' },
                            { value: 'Fin de contrat de travail', title: 'Fin de contrat de travail' },
                            { value: 'Photo Invalidée', title: 'Photo Invalidée' }
                        ],
                    },
                },
            },
            signalee: {
                title: 'Signalée',
                filter: {
                    type: 'list',
                    config: {
                        selectText: '',
                        list: [
                            { value: 'Oui', title: 'Oui' },
                            { value: 'Non', title: 'Non' }
                        ],
                    },
                },
            },

        },
        selectMode: 'multi', //to add multi row check box's
        noDataMessage: "Aucune ligne trouvée",
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

    // Surcharge de la méthode de filtrage des lignes
    private customFilterStatutFunction(cell?: any, search?: string): boolean {
        if (search === cell || search === '') {
            return true;
        } else {
            return false;
        }
    }
    /**
     * Méthode pour gérer la sélection/désélection d'une ligne de la table
     * @param e : objet contenant l'objet sélectionné et la liste de données 
     */
    private onChkSelectionClick(e: any): void {
        var carte: CarteHelper = new CarteHelper();
        if (e.data === null) {
            this.selectAll = !this.selectAll;
            if (this.selectAll) {
                this.checkedEltList = e.source.data;
            } else {
                this.checkedEltList = [];
            }
        } else {
            carte = carte.copy(e.data);
            if (e.data.selection === false) {
                this.checkedEltList.push(carte);
            } else {
                this.checkedEltList = this.checkedEltList.filter(c => c.id !== e.data.id);
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

    private searchCardByNum(cardNum: string) {
        let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
        if (cardNum) {
            this.loading = true;
            this._sessionCntrlService.searchCardByNum(this.authService.user.ID, this.sessionCntrl.Reference, cardNum.replace(/\s/g, '')).subscribe(
                (carte: Carte) => {
                    this.loading = false;
                    if (carte !== null && carte.ID !== 0) {
                        if (this.addCarteToListeCartes(carte)) {
                            //this.source.load(this.listCartes);
                            this.showAddedIcon = true;
                            this._sharedService.emitChange('La carte a été bien ajoutée à cette session de contrôle et son statut est:' + (carte.IndValide === 0 ? 'invalide' : 'valide'));
                            timer.subscribe((t: number) => { this.showAddedIcon = false; this._sharedService.emitChange(``) });
                        } else {
                            this._sharedService.emitChange(`La carte fait déjà partie de la liste de cartes de cette session de contrôle`);
                            timer.subscribe((t: number) => { this.showAddedIcon = false; this._sharedService.emitChange(``) });
                        }
                    } else {
                        this._sharedService.emitChange(`La carte demandée est introuvable`);
                        timer.subscribe((t: number) => { this.showAddedIcon = false; this._sharedService.emitChange(``) });
                    }
                },
                (err: any) => {
                    this.loading = false;
                    switch (err.status) {
                        case 409:
                            this._sharedService.emitChange(err.json());
                            timer.subscribe((t: number) => this._sharedService.emitChange(``));
                            break;
                        case 404:
                            this._sharedService.emitChange(`Une erreur s'est produite, la carte n'as pas pu être rajoutée à cette session de contrôle`);
                            timer.subscribe((t: number) => { this._sharedService.emitChange(``) });
                            break;
                        default:
                            this._sharedService.emitChange(`Une erreur s'est produite, la carte n'as pas pu être rajoutée à cette session de contrôle`);
                            timer.subscribe((t: number) => this._sharedService.emitChange(``));
                            break;
                    }
                }
            );
        } else {
            this._sharedService.emitChange(`Vous n'avez pas saisi un numéro de carte`);
            timer.subscribe((t: number) => this._sharedService.emitChange(``));
        }
    }
}