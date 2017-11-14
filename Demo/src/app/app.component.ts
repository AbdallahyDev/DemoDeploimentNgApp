import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './commun/services/SharedService';
import { AuthService } from './commun/services/authentification/AuthService';
import { HabilitationService } from './commun/services/habilitation/habilitation-service';
import { CorpsControle } from './commun/modeles/CorpsControle';
import { Utilisateur } from './commun/modeles/Utilisateur';
import { AffectationTerritoriale } from './commun/modeles/AffectationTerritoriale';
import { AffectationTerritorialeService } from './commun/services/affectation-territoriale/affectation-territorial-service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.template.html',
    styleUrls: ['./app.component.style.less']
})

export class AppComponent implements OnInit {

    // le message d'information à afficher selon le contenu principal de la page
    private msgInfo: string;

    private listeCCntrl: Array<CorpsControle>;
    constructor(private _sharedService: SharedService, private authService: AuthService, private router: Router,
        private _habService: HabilitationService, private _atService: AffectationTerritorialeService) {
        this.listeCCntrl = [];
        _sharedService.changeEmitted$.subscribe(
            text => {
                this.msgInfo = text;
            });
        _sharedService.listeCorpsCntrlChangeEmitted.subscribe(
            listeCorpsCntrl => {
                this.listeCCntrl = listeCorpsCntrl;
            });
    }

    /**
     * Méthode pour initialiser les varibles lors de l'appel du composant
     */
    ngOnInit() {
        this.msgInfo = "";
    }

    /**
     * Méthode déclencher après une authentification valide
     * @param isAuthentified : boolean pour dire si l'authentification a réussi ou pas
     */
    public authentifier(isAuthentified: boolean): void {
        alert("Déclenchement de l'event réussi" + isAuthentified);
    }


    private checkShowListeCCntrl(): boolean {
        return this.authService.user.Profil.Code.toUpperCase().includes("UCF") && (this.router.url.includes("habilitations") || this.router.url.includes("affectations"));
    }

    private getStatusSessions(): boolean {
        return this.router.url.includes("session") || this.router.url.includes("carte");
    }

    private showSession(): boolean {
        var res: boolean = true;
        if (this.authService.user.Profil.Code.toUpperCase().includes("UCF")) {
            res = false;
        }
        return res;
    }

    private showHabilitation(): boolean {
        var res: boolean = true;
        if (this.authService.user.Profil.Code.toUpperCase().includes("CONTR")) {
            res = false;
        }
        return res;
    }

    private showAffectation(): boolean {
        var res: boolean = true;
        if (this.authService.user.Profil.Code.toUpperCase().includes("CONTR")) {
            res = false;
        }
        return res;
    }

    private getStatusHabilitations(): boolean {
        return this.router.url.includes("habilitation");
    }

    private getStatusAffectations(): boolean {
        return this.router.url.includes("affectation");
    }

    private updateHabilitationListe(libelle: string) {
        if (this.router.url.includes("affectation")) {
            this._atService.GetAllAffTerritoriale(this.authService.user.ID, this.listeCCntrl.find(e => e.Libelle === libelle).ID).subscribe(
                (data: Array<AffectationTerritoriale>) => {
                    this._sharedService.emitListeATChange(data);
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                }
            );

        } else {
            this._habService.GetAllHabByUserId(this.authService.user.ID, this.listeCCntrl.find(e => e.Libelle === libelle).ID).subscribe(
                (data: Array<Utilisateur>) => {
                    this._sharedService.emitListeHabilitationChange(data);
                },
                (err: any) => {
                    this._sharedService.emitChange(`Une erreur s'est produite, veuillez réessayer ultérieurement`);
                }
            );
        }



    }
}