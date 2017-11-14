import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ViewCell } from 'ng2-smart-table';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'button-view',
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
                        <button type="button" class="btn btn-primary" (click)="redirect()">Continuer</button>
                </modal-footer>
            </modal>
            <a class="bouton bouton-bleu petit" [routerLink]="['/detail-session', rowData.id]" title="Voir le détail"><i class="fa fa-eye"></i></a>
            <a class="bouton bouton-bleu petit" [routerLink]="['/liste-cartes-session', rowData.id]" title="Voir liste de cartes"><i class="fa fa-pencil-square-o"></i></a>
            <a class="bouton bouton-bleu petit" href="javascript:;" (click)="onClotureClick()" title="Clôturer" *ngIf="etat!='C'"><i class="fa fa-lock" aria-hidden="true"></i></a>
            <a class="bouton bouton-rouge petit" href="javascript:;" (click)="onSuppressionClick()" title="supprimer" *ngIf="etat!='C'"><i class="fa fa-remove" style="font-size:9px;color:white"></i></a>    
    `
})
export class ButtonActionComponent implements ViewCell, OnInit {
    private etat: string;
    private msgConfirmation: string;
    private urlRedirection: string;
    @Input() value: string | number;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    public constructor(private _router: Router/*, private _modal: ModalComponent*/) {
        this.msgConfirmation = "";
        this.urlRedirection = "";
    }

    @ViewChild('modalConfirmation')
    modal: ModalComponent;

    ngOnInit() {
        this.etat = this.value.toString().substring(0, 1).toUpperCase();
    }

    onClotureClick() {
        this.msgConfirmation = "Souhaitez-vous clôturer cette session ?"
        this.urlRedirection = "/cloture-session";
        this.modal.open();
        // emit si besoin
        this.save.emit(this.rowData);
    }

    onSuppressionClick() {
        this.msgConfirmation = "Souhaitez-vous supprimer cette session ?";
        this.urlRedirection = "/suppression-session";
        this.modal.open();

        this.save.emit(this.rowData);
    }

    close() {
        this.modal.close();
    }

    redirect() {
        this.modal.close();
        this._router.navigate([this.urlRedirection, this.rowData.reference]);
    }
}