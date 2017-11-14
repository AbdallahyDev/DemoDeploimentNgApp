import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewCell } from 'ng2-smart-table';
import { Observable } from 'rxjs/Rx';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AuthService } from '../../commun/services/authentification/AuthService';
import { HabilitationService } from '../../commun/services/habilitation/habilitation-service';
import { SharedService } from '../../commun/services/SharedService';
import { constant } from '../../commun/constants'

@Component({
    selector: 'button-view-habilitation',
    template: `
            <modal #modalConfirmation>
                <modal-header>
                    <h4 class="modal-title">Confirmation</h4>
                </modal-header>
                <modal-body>
                    <div class="form-group">
                      {{msgConfirmation}}
                    </div>
                </modal-body>
                <modal-footer>
                      <button type="button" class="btn btn-default" data-dismiss="modal" (click)="modal.close()">Annuler</button>
                        <button type="button" class="btn btn-primary" (click)="supprimerHabilitation()">Continuer</button>
                </modal-footer>
            </modal>
            <a class="bouton bouton-bleu petit" [routerLink]="['/detail-habilitation', rowData.ID]" title="Voir le détail"><i class="fa fa-eye"></i></a>
            <a class="bouton bouton-rouge petit" href="javascript:;" (click)="onSuppressionClick()" title="supprimer" *ngIf="showSuppAndTransfertButton()"><i class="fa fa-remove" style="font-size:15px;color:white"></i></a>   
            <a class="bouton bouton-bleu petit" [routerLink]="['/selection-habilitation-cible',  rowData.ID]" title="transferer sessions contrôle" *ngIf="showSuppAndTransfertButton()"><i class="fa fa-share-square-o"></i></a>
            <a class="bouton bouton-bleu petit" href="javascript:;" (click)="onRenvoyerEmailClick()" title="Renvoyer email d'activation" *ngIf="rowData.Statut ==='En attente activation'"><i class="fa fa-reply" aria-hidden="true"></i></a> 
    `
})
export class ButtonHabilationActionComponent implements ViewCell, OnInit {
    private statut: string;
    private msgConfirmation: string;
    private urlRedirection: string;
    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    public constructor(private _router: Router, private authService: AuthService, private _habService: HabilitationService, private _sharedService: SharedService) {
        this.msgConfirmation = "";
        this.urlRedirection = "";
    }

    @ViewChild('modalConfirmation')
    modal: ModalComponent;

    ngOnInit() {
        this.statut = this.value.toString().substring(0, 1).toUpperCase();
    }

    private showSuppAndTransfertButton(): boolean {
        // A ne pas afficher si l'utilisateur est un profil contrôleur ou gestionnaire UCF
        return this.authService.user.Profil.Code.toUpperCase().includes("CONTR") || this.authService.user.Profil.Code.toUpperCase().includes("GEST") ? false : true;
    }


    onRenvoyerEmailClick() {
        this._habService.RenvoyerEmailActivation(this.rowData.ID, this.authService.user.ID).subscribe(
            (data: any) => {
                if (data) {
                    this._sharedService.emitChange(`Un email d'activation a été renvoyé à ` + this.rowData.Nom + " " + this.rowData.Prenom);
                    let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
                    timer.subscribe((t: number) => this._sharedService.emitChange(``));
                } else {
                    this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement `);
                    let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
                    timer.subscribe((t: number) => this._sharedService.emitChange(``));
                }
            },
            (err: any) => {
                let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
                switch (err.status) {
                    case 409:
                        this._sharedService.emitChange(err.json());
                        timer.subscribe((t: number) => this._sharedService.emitChange(``));
                        break;
                    case 403:
                        this._sharedService.emitChange(`Un souci technique n'a pas permis de renvoyer le lien d'activation. Merci de réessayer ultérieurement`);
                        timer.subscribe((t: number) => this._sharedService.emitChange(``));
                        break;
                    case 400:
                        this._sharedService.emitChange(err.json());
                        timer.subscribe((t: number) => this._sharedService.emitChange(``));
                        break;
                    default:
                        this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                        timer.subscribe((t: number) => this._sharedService.emitChange(``));
                        break;
                }
            }
        );

    }

    onSuppressionClick() {
        this.msgConfirmation = `Souhaitez-vous définitivement supprimer l'habilitation pour ${this.rowData.Nom} ${this.rowData.Prenom}?`;
        this.modal.open();
    }


    close() {
        this.modal.close();
    }

    supprimerHabilitation() {
        this.modal.close();
        this._habService.SupprimerHabilitation(this.rowData.ID, this.authService.user.ID).subscribe(
            (data: any) => {
                if (data) {
                    this._sharedService.emitListeHabilitationChange(this._habService.listeHabilitation.filter(e => e.ID !== this.rowData.ID));
                    this._sharedService.emitChange(`L’habilitation pour  ${this.rowData.Nom} ${this.rowData.Prenom} a bien été supprimée`);
                    let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
                    timer.subscribe((t: number) => this._sharedService.emitChange(``));
                } else {
                    this._sharedService.emitChange(`L’habilitation pour  ${this.rowData.Nom} ${this.rowData.Prenom} n'a pas été supprimée, veuillez réessayer ultérieurement`);
                    let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
                    timer.subscribe((t: number) => this._sharedService.emitChange(``));
                }
            },
            (err: any) => {
                var codeErreur: Array<string> = err.split('|');
                let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);

                switch (codeErreur[0]) {
                    case 'USER_CANNOTBEDELETED':
                        this._sharedService.emitChange(codeErreur[1].split('|')[0]);
                        timer.subscribe((t: number) => this._sharedService.emitChange(``));
                        break;
                    default:
                        this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                        timer.subscribe((t: number) => this._sharedService.emitChange(``));
                        break;
                }
            }
        );
    }
}