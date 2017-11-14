import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewCell } from 'ng2-smart-table';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AuthService } from '../../commun/services/authentification/AuthService';

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
            <a class="bouton bouton-bleu petit" [routerLink]="['/detail-habilitation', 54789]" title="Voir le détail"><i class="fa fa-eye"></i></a>
            <a class="bouton bouton-rouge petit" href="javascript:;" (click)="onSuppressionClick()" title="supprimer" *ngIf="showSuppAndTransfertButton()"><i class="fa fa-remove" style="font-size:9px;color:white"></i></a>   
            <a class="bouton bouton-bleu petit" [routerLink]="['/selection-habilitation-cible', 222]" title="transferer sessions contrôle" *ngIf="showSuppAndTransfertButton()"><i class="fa fa-share-square-o"></i></a>
            <a class="bouton bouton-bleu petit" href="javascript:;" (click)="onRenvoyerEmailClick()" title="Renvoyer email d'activation" *ngIf="rowData.Statut==='En attente activation'"><i class="fa fa-reply" aria-hidden="true"></i></a> 
    `
})
export class ButtonHabilationActionComponent implements ViewCell, OnInit {
    private statut: string;
    private msgConfirmation: string;
    private urlRedirection: string;
    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    public constructor(private _router: Router, private authService: AuthService) {
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
        return this.authService.user.Profil.Code.toUpperCase().includes("CONTR") || this.authService.user.Profil.Code.toUpperCase().includes("GEST")? false : true;
    }


    onRenvoyerEmailClick() {
        this.msgConfirmation = "Souhaitez-vous clôturer cette session ?"
        this.urlRedirection = "/cloture-session";
       // this.modal.open();
        // emit si besoin
        this.save.emit(this.rowData);

    }

    onSuppressionClick() {
        this.msgConfirmation = "Souhaitez-vous supprimer cette habilitation ?";
       // this.urlRedirection = "/suppression-session";
        this.modal.open();

        this.save.emit(this.rowData);
    }

    close() {
        this.modal.close();
    }

    supprimerHabilitation() {
        this.modal.close();
        // appeler le service de suppresion
        //this._router.navigate([this.urlRedirection, this.rowData.reference]);
    }
}