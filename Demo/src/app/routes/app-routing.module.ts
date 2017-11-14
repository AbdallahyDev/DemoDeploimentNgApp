import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from '../app.component';
import { SessionCntrl } from '../session-controle/session-cntrl.component';
import { CreationSessionCntrl } from '../session-controle/creation/creation-session-cntrl.component';
import { PartageSessionCntrl } from '../session-controle/partage/partage-session-cntrl.component';
import { TransfertSessionCntrl } from '../session-controle/transfert/transfert-session-cntrl.component';
import { ListeHabilitation } from '../habilitations/liste-habilitation.component';
import { ListAffectationTerritoriale } from '../affetations-territoriales/list-affectation-territoriale.component';
import { Authentification } from '../authentification/authentification.component';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from '../securite/AuthGuard';
import { PageNotFoundComponent } from '../commun/components/not-found';
import { IdentifiantOublie } from '../authentification/identifiant-oublie/identifiant-oublie.component';
import { MotDePasseOublie } from '../authentification/mdp/mdp-oublie/mdp-oublie.component';
import { DetailSessionCntrl } from '../session-controle/detail/detail-session-cntrl.component';
import { ClotureSessionCntrl } from '../session-controle/cloture/cloture-session-cntrl.component';
import { ListeCartesSessionCntrl } from '../session-controle/cartes/liste-cartes/liste-carte-session-cntrl.component';
import { RechercheCarteComponent } from '../session-controle/cartes/recherche-cartes/recherche-cartes.component'; 
import { DetailCarteComponent } from '../session-controle/cartes/detail-cartes/detail-cartes.component';
import { SuppressionSessionCntrl } from '../session-controle/suppression/suppression-session-cntrl.component';
import { CreationHabilitation } from '../habilitations/creation/creation-habilitation.component';
import { DetailHabilitation } from '../habilitations/detail/detail-habilitation.component';
import { SelectionHabilitationCible } from '../habilitations/transfert/selection-habilitation-cible.component'; 
import { CreationAffectationTerritoriale } from '../affetations-territoriales/creation/creation-affectation-territoriale.component';
import { CreationMotDePasse } from '../authentification/mdp/creation-mdp/creation-mdp.component';

const appRoutes: Routes = [
    { path: "", redirectTo: "/authentification", pathMatch: "full" },
    { path: "authentification", component: Authentification },
    { path: "identifiant-oublie", component: IdentifiantOublie },
    { path: "mot-de-passe-oublie", component: MotDePasseOublie }, 
    { path: "validation/:token", component: CreationMotDePasse}, 
    { path: "sessions", component: SessionCntrl, canActivate: [AuthGuard] },
    { path: "detail-session/:idSession", component: DetailSessionCntrl, canActivate: [AuthGuard] },
    { path: "detail-habilitation/:idHab", component: DetailHabilitation, canActivate: [AuthGuard] },
    { path: "cloture-session/:idSession", component: ClotureSessionCntrl, canActivate: [AuthGuard] },
    { path: "liste-cartes-session/:idSession", component: ListeCartesSessionCntrl, canActivate: [AuthGuard] },
    { path: "suppression-session/:idSession", component: SuppressionSessionCntrl, canActivate: [AuthGuard] },
    { path: "creation-sessions", component: CreationSessionCntrl, canActivate: [AuthGuard] }, 
    { path: "creation-affectation-territoriale", component: CreationAffectationTerritoriale, canActivate: [AuthGuard] }, 
    { path: "creation-habilitation", component: CreationHabilitation, canActivate: [AuthGuard] }, 
    { path: "partage-sessions", component: PartageSessionCntrl, canActivate: [AuthGuard] },
    { path: "transfert-sessions", component: TransfertSessionCntrl, canActivate: [AuthGuard] },
    { path: "habilitations", component: ListeHabilitation, canActivate: [AuthGuard] },
    { path: "affectations", component: ListAffectationTerritoriale, canActivate: [AuthGuard] }, 
    { path: "recherche-cartes", component: RechercheCarteComponent, canActivate: [AuthGuard] }, 
    { path: "detail-cartes", component: DetailCarteComponent, canActivate: [AuthGuard] }, 
    { path: "selection-habilitation-cible/:idHab", component: SelectionHabilitationCible, canActivate: [AuthGuard] }, 
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }