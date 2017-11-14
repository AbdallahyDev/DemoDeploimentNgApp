import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionCntrlService } from '../../commun/services/session-controle/session-controle-service';
import { SharedService } from '../../commun/services/SharedService';
import { SessionControle } from '../../commun/modeles/SessionControle';
import { Observable } from 'rxjs/Rx';
import { constant } from '../../commun/constants';
import { AuthService } from '../../commun/services/authentification/AuthService';
import { Utilisateur } from '../../commun/modeles/Utilisateur';
import { CorpsControle } from '../../commun/modeles/CorpsControle';
import { AffectationTerritorialeService } from '../../commun/services/affectation-territoriale/affectation-territorial-service'
import { HabilitationService } from '../../commun/services/habilitation/habilitation-service';
import { CorpsControleService } from '../../commun/services/corps-controle/corps-controle-service';
import { AffectationTerritoriale } from '../../commun/modeles/AffectationTerritoriale';
import { Profil } from '../../commun/modeles/Profile';
@Component({
    selector: 'creation-habilitation',
    templateUrl: './creation-habilitation.template.html',
    styleUrls: ['./creation-habilitation.style.css']
})
export class CreationHabilitation {
    // le message d'erreur à afficher à l'utilisateur 
    private msgErreur: string;
    private loading: boolean;
    private showMsg: boolean;
    private refSessionLength: number;
    private newHabilitation: Utilisateur;
    private listeCorpsControle: Array<CorpsControle>;
    private listeAT: Array<AffectationTerritoriale>;
    private listeProfil: Array<Profil>;
    private courrielConfirmation: string = "";
    private dataHasChanged: boolean;
    private listecorpscontrlIsDisabled: boolean;
    constructor(http: Http, private _sharedService: SharedService, private _sessionCntrlService: SessionCntrlService, private authService: AuthService,
        private _router: Router, private _affectationTerritorialeService: AffectationTerritorialeService, private _habService: HabilitationService, private _cControleService: CorpsControleService) {
        this.refSessionLength = constant.REF_SESSION_LENGTH;
        this.loading = false;
        this.dataHasChanged = false;
        this._sharedService.emitChange(``);
        this.showMsg = false;
        this.listecorpscontrlIsDisabled = true;
        this.courrielConfirmation = " ";
        this.newHabilitation = new Utilisateur();
        this.newHabilitation.courrielConfirmation = "";
        this.listeCorpsControle = new Array<CorpsControle>();
        this.listeAT = [];
        this._habService.getAllProfils().subscribe(
            (data: Array<Profil>) => {
                this.listeProfil = this.buildListeProfile(data);
            },
            (err: any) => {
                this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
            }
        );

        if (this.authService.user.Profil.Code.toUpperCase().includes("UCF")) {
            this.listecorpscontrlIsDisabled = false;
            this._cControleService.GetAllCorpsControle().subscribe(
                (data: Array<CorpsControle>) => {
                    this.listeCorpsControle = data;
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                }
            );
        } else {
            this.listeCorpsControle.push(new CorpsControle(this.authService.user.AffectationTerritoriale.CorpsControle.ID, this.authService.user.AffectationTerritoriale.CorpsControle.Libelle, this.authService.user.AffectationTerritoriale.CorpsControle.IndAuthentUserPwd));
            this._affectationTerritorialeService.GetListeATByCorpsCntrlId(this.authService.user.AffectationTerritoriale.CorpsControle.ID).subscribe(
                (data: Array<AffectationTerritoriale>) => {
                    this.listeAT = data;
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                }
            );
        }
    }

    private creerNewHabilitation() {

        this.newHabilitation.IndStatut = 2;
        this.newHabilitation.DateCreation = new Date();

        if (this.newHabilitation.Profil.Code.includes("UCF")) {
            this.newHabilitation.AffectationTerritoriale = null;
        } else {
            if (this.newHabilitation.AffectationTerritoriale === undefined && !this.authService.user.Profil.Code.includes("UCF")) {
                this.newHabilitation.AffectationTerritoriale = this.listeAT.length > 0 ? this.listeAT[0] : null;
            }
        }
        if (!this.newHabilitation.Profil.Code.includes("UCF") && !this.newHabilitation.AffectationTerritoriale) {
            let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
            this._sharedService.emitChange(`Le champs affectation territoriale est obligatoire pour la création d'un profil non UCF`);
            timer.subscribe((t: number) => { this._sharedService.emitChange(``); });
        } else {
            this.loading = true;
            this._habService.CreerHabilitation(this.authService.user.ID, this.newHabilitation).subscribe(
                (creationHassDone: boolean) => {
                    this.loading = false;
                    let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
                    if (creationHassDone) {
                        this._sharedService.emitChange(`L'habilitation pour  ${this.newHabilitation.Nom} ${this.newHabilitation.Prenom} a bien été créée`);
                        timer.subscribe((t: number) => { this._sharedService.emitChange(``); this._router.navigate(['./habilitations']); });
                    } else {

                        this._sharedService.emitChange(`L'habilitation pour  ${this.newHabilitation.Nom} ${this.newHabilitation.Prenom} n'a pas pu être créée, veuillez réessayer ultérieurement`);
                        timer.subscribe((t: number) => { this._sharedService.emitChange(``); this._router.navigate(['./habilitations']); });
                    }
                },
                (err: any) => {
                    this.loading = false;
                    let timer = Observable.timer(constant.TIME_FOR_SHOWING_MSG_INF);
                    switch (err.status) {
                        case 409:
                            this._sharedService.emitChange(err.json());
                            timer.subscribe((t: number) => this._sharedService.emitChange(``));
                            break;
                        case 403:
                            this._sharedService.emitChange(`L'habilitation a été créée mais un souci technique n'a pas permis d'envoyer le lien d'activation. Merci de procéder au renvoi du courriel via l'interface ultérieurement`);
                            timer.subscribe((t: number) => { this._sharedService.emitChange(``); this._router.navigate(['./habilitations']); });
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
    }

    private buildListeProfile(l: Array<Profil>): Array<Profil> {
        let data = new Array<Profil>();
        if (this.authService.user.Profil.Code.toUpperCase().includes("ADMINNIV2")) {
            data = l.filter(e => !e.Code.includes("UCF") && !e.Code.includes("ADMINNIV1"))
        }
        if (this.authService.user.Profil.Code.toUpperCase().includes("ADMINNIV1")) {
            data = l.filter(e => !e.Code.includes("UCF"))
        }
        return data.length !== 0 ? data : l;
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

    private checkIsUCFProfil(): boolean {
        return this.authService.user.Profil.Code.toUpperCase().includes("UCF");
    }

    private getClass(): string {
        return this.authService.user.Profil.Code.toUpperCase().includes("UCF") ? 'col-lg-4 col-lg-push-2 custom-class-corps-contre-input-creation-ucf' : 'col-lg-2 col-lg-push-2 custom-class-corps-contre-input-creation';
    }

    private OnAffTerrChange(libelle: string) {
        if (libelle === "") {
            this.newHabilitation.AffectationTerritoriale = null;
        } else {
            this.newHabilitation.AffectationTerritoriale = this.listeAT.find(e => e.Libelle === libelle);
        }
    }

    private OnProfilChange(libelle: string) {
        this.newHabilitation.Profil = this.listeProfil.find(e => e.Libelle === libelle);
    }
    private annuler() {
        this._router.navigate(['./habilitations']);
    }

    private updateHabilitationListe(e: any) {

    }
}