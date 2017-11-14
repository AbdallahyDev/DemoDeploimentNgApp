import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Utilisateur } from '../../commun/modeles/Utilisateur'
import { AuthService } from '../../commun/services/authentification/AuthService'
import { SharedService } from '../../commun/services/SharedService'
import { constant } from '../../commun/constants';
import { CorpsControle } from '../../commun/modeles/CorpsControle';
import { AffectationTerritorialeService } from '../../commun/services/affectation-territoriale/affectation-territorial-service'
import { CorpsControleService } from '../../commun/services/corps-controle/corps-controle-service';
import { AffectationTerritoriale } from '../../commun/modeles/AffectationTerritoriale';


@Component({
    selector: 'identifiant-oublie',
    templateUrl: './identifiant-oublie.template.html',
    styleUrls: ['./identifiant-oublie.style.css']
})
export class IdentifiantOublie implements OnInit {
    private listeCorpsControle: Array<CorpsControle>;
    private listeAT: Array<AffectationTerritoriale>;
    private user: Utilisateur;
    private newHabilitation: Utilisateur;
    private msgErreur: string;
    private loading: boolean;
    constructor(private authService: AuthService, private _sharedService: SharedService, private _router: Router, private _cControleService: CorpsControleService, private _affectationTerritorialeService: AffectationTerritorialeService) {
        this.user = new Utilisateur();
        this._cControleService.GetAllCorpsControle().subscribe(
            (data: Array<CorpsControle>) => {
                this.listeCorpsControle = data;
                this._affectationTerritorialeService.GetListeATByCorpsCntrlId(this.listeCorpsControle[0].ID).subscribe(
                    (data: Array<AffectationTerritoriale>) => {
                        this.listeAT = data;
                    },
                    (err: any) => {
                        this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                    }
                );
            },
            (err: any) => {
                this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
            });

    }
    ngOnInit() {
    }
    private updateATListe(libelle: string) {
        if (libelle === "") {
            this.listeAT = []
        } else {
            var idCorpsCntrl: number = this.listeCorpsControle.find(e => e.Libelle === libelle).ID;
            this._affectationTerritorialeService.GetListeATByCorpsCntrlId(idCorpsCntrl).subscribe(
                (data: Array<AffectationTerritoriale>) => {
                    this.listeAT = data;
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                }
            );
        }

    } 
    private OnAffTerrChange(libelle: string) {
        if (libelle === "") {
            this.user.AffectationTerritoriale = null;
        } else {
            this.user.AffectationTerritoriale = this.listeAT.find(e => e.Libelle === libelle);
        }
    }
    private envoyer() {
        let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
        this.loading = true;

        if (!this.user.AffectationTerritoriale) {
            this.user.AffectationTerritoriale = this.listeAT[0];
        }
        this.authService.checkUserValidity(this.user.AffectationTerritoriale.ID, this.user.Nom, this.user.Prenom, this.user.Courriel).subscribe(
            (result: boolean) => {
                this.loading = false;
                if (result) {
                    this.msgErreur = `Un courriel vous a été envoyé avec votre identifiant. Merci de consulter votre messagerie`;
                    timer.subscribe((t: number) => { this.msgErreur = ""; this._router.navigate(['./authentification']); });
                } else {
                    this.msgErreur = `Une erreur est survenue, veuillez ressayer ultérieurement`;
                    timer.subscribe((t: number) => { this.msgErreur = ""; this._router.navigate(['./authentification']); });
                }
            },
            (err: any) => {
                this.loading = false;
                var codeErreur: Array<string> = err.includes("|")?err.split('|'):err;
                switch (codeErreur[0]) {
                    case 'USER_NOTFOUND':
                        this.msgErreur = 'Pas de correspondance sur la saisie effectuée ';
                        break;
                    case 'USER_DESACTIVATED':
                        this.msgErreur = `${constant.USER_DESACTIVATED} : ${codeErreur[1]}`;
                        break;
                    default:
                        this.msgErreur = `Une erreur interne s'est produite`;
                        break;
                }
            }
        );
    }
}