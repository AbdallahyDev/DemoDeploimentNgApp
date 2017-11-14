import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ReCaptchaModule } from 'angular2-recaptcha';


import { AppRoutingModule } from "../routes/app-routing.module";
import { AppComponent } from '../app.component';
import { SessionCntrl } from '../session-controle/session-cntrl.component';
import { CreationSessionCntrl } from '../session-controle/creation/creation-session-cntrl.component';
import { PartageSessionCntrl } from '../session-controle/partage/partage-session-cntrl.component';
import { TransfertSessionCntrl } from '../session-controle/transfert/transfert-session-cntrl.component';
import { ListeHabilitation } from '../habilitations/liste-habilitation.component';
import { ListAffectationTerritoriale } from '../affetations-territoriales/list-affectation-territoriale.component';
import { IdentifiantOublie } from '../authentification/identifiant-oublie/identifiant-oublie.component';
import { MotDePasseOublie } from '../authentification/mdp/mdp-oublie/mdp-oublie.component';
import { Header } from '../commun/components/header/header.component';
import { Footer } from '../commun/components/footer/footer.component';
import { EqualValidator } from '../commun/directives/equal-validator';
import { PageNotFoundComponent } from '../commun/components/not-found';
import { Authentification } from '../authentification/authentification.component';
import { SharedService } from '../commun/services/SharedService';
import { SessionCntrlService } from '../commun/services/session-controle/session-controle-service';
import { HabilitationService } from '../commun/services/habilitation/habilitation-service';
import { AuthService } from '../commun/services/authentification/AuthService';
import { AuthGuard } from '../securite/AuthGuard';
import { ButtonSessionActionComponent } from '../session-controle/boutons-actions/bouton-action.component';
import { DetailSessionCntrl } from '../session-controle/detail/detail-session-cntrl.component';
import { ClotureSessionCntrl } from '../session-controle/cloture/cloture-session-cntrl.component';
import { ListeCartesSessionCntrl } from '../session-controle/cartes/liste-cartes/liste-carte-session-cntrl.component';
import { RechercheCarteComponent } from '../session-controle/cartes/recherche-cartes/recherche-cartes.component';
import { DetailCarteComponent } from '../session-controle/cartes/detail-cartes/detail-cartes.component';
import { SuppressionSessionCntrl } from '../session-controle/suppression/suppression-session-cntrl.component';
import { EtatSignificationPipe } from '../commun/filtres/session-etat-pipe';
import { NumCarteFormatPipe } from '../commun/filtres/num-carte-format-pipe';
import { CreationHabilitation } from '../habilitations/creation/creation-habilitation.component';
import { ButtonHabilationActionComponent } from '../habilitations/boutons-actions/button-habilation-action';
import { DetailHabilitation } from '../habilitations/detail/detail-habilitation.component';
import { SelectionHabilitationCible } from '../habilitations/transfert/selection-habilitation-cible.component';
import { CorpsControleService } from '../commun/services/corps-controle/corps-controle-service';
import { AffectationTerritorialeService } from '../commun/services/affectation-territoriale/affectation-territorial-service';
import { ButtonAffTerritorialeActionComponent } from '../affetations-territoriales/boutons-actions/ButtonAffTerritorialeActionComponent';
import { CreationAffectationTerritoriale } from '../affetations-territoriales/creation/creation-affectation-territoriale.component';
import { CreationMotDePasse } from '../authentification/mdp/creation-mdp/creation-mdp.component';

@NgModule({
    declarations: [
        AppComponent,
        SessionCntrl,
        Header,
        Footer,
        ListeHabilitation,
        ListAffectationTerritoriale,
        Authentification,
        PageNotFoundComponent,
        CreationSessionCntrl,
        PartageSessionCntrl,
        TransfertSessionCntrl,
        IdentifiantOublie,
        MotDePasseOublie,
        ButtonSessionActionComponent,
        DetailSessionCntrl,
        ClotureSessionCntrl,
        ListeCartesSessionCntrl,
        SuppressionSessionCntrl,
        EtatSignificationPipe,
        RechercheCarteComponent,
        DetailCarteComponent,
        CreationHabilitation,
        DetailCarteComponent,
        NumCarteFormatPipe,
        ButtonHabilationActionComponent,
        ButtonAffTerritorialeActionComponent,
        DetailHabilitation,
        SelectionHabilitationCible,
        EqualValidator,
        CreationAffectationTerritoriale,
        CreationMotDePasse
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        Ng2SmartTableModule,
        FormsModule,
        Ng2Bs3ModalModule,
        ReCaptchaModule
    ],
    providers: [
        SharedService, AuthService, AuthGuard, SessionCntrlService, HabilitationService, AffectationTerritorialeService, CorpsControleService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
