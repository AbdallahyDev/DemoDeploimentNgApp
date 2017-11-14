import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ViewCell } from 'ng2-smart-table';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AuthService } from '../../commun/services/authentification/AuthService';
import { HabilitationService } from '../../commun/services/habilitation/habilitation-service';
import { SharedService } from '../../commun/services/SharedService';
import { AffectationTerritorialeService } from '../../commun/services/affectation-territoriale/affectation-territorial-service';
import {constant} from'../../commun/constants'
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
                        <button type="button" class="btn btn-primary" (click)="supprimerAT()">Continuer</button>
                </modal-footer>
            </modal>
            <a class="bouton bouton-rouge petit" href="javascript:;" (click)="onSuppressionClick()" title="supprimer" *ngIf="showSuppressionButton()"><i class="fa fa-remove" style="font-size:15px;color:white"></i></a>   
    `
})
export class ButtonAffTerritorialeActionComponent implements ViewCell, OnInit {
    private statut: string;
    private msgConfirmation: string;
    private urlRedirection: string;
    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    public constructor(private _router: Router, private authService: AuthService, private _atService: AffectationTerritorialeService, private _sharedService: SharedService) {
    }

    @ViewChild('modalConfirmation')
    modal: ModalComponent;


    ngOnInit() {
        this.statut = this.value.toString().substring(0, 1).toUpperCase();
    }

    private showSuppressionButton(): boolean {
        return this.authService.user.Profil.Code.includes("ADMINUCF") || this.authService.user.Profil.Code.includes("ADMINNIV1");
    }

    onSuppressionClick() {
        this.msgConfirmation = `Souhaitez-vous définitivement supprimer l'affectation territoriale ${this.rowData.Libelle} ?`;
        this.modal.open();
    }

    close() {
        this.modal.close();
    }

    supprimerAT() {
        this.modal.close();
        this._atService.SupprimerAffTerritoriale(this.rowData.ID, this.authService.user.ID).subscribe(
            (data: any) => {
                if (data) {
                    this._sharedService.emitListeATChange(this._atService.listeAffectationTerritoriale.filter(e => e.ID !== this.rowData.ID));
                    this._sharedService.emitChange(`L'affectation territoriale  ${this.rowData.Libelle} a bien été supprimée`);
                    let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
                    timer.subscribe((t: number) => this._sharedService.emitChange(``));
                }
            },
            (err: any) => {
                var codeErreur: Array<string> = err.split('|');
                let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);

                switch (codeErreur[0]) {
                    case 'AT_CANNOTBEDELETED':
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