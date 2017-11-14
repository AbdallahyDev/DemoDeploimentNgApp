import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { SessionControle } from '../../modeles/SessionControle';
import { Carte } from '../../modeles/Carte';
import { constant } from '../../constants';
import { AffectationTerritoriale } from '../../modeles/AffectationTerritoriale';
import { CorpsControle } from '../../modeles/CorpsControle';

@Injectable()
export class AffectationTerritorialeService {
    apiURL: string = constant.API_URL;
    public listeAffectationTerritoriale: Array<AffectationTerritoriale>;
    public listeAffTerByCorpsCntr: Array<AffectationTerritoriale>;
    constructor(private http: Http) {
    }

    /*
   ** Récupérer la liste des CorpsControle
   */
    public GetAllAffTerritoriale(utilisateurId: number, corpControleId: number): Observable<Array<AffectationTerritoriale>> {
        return this.http.get(this.apiURL + "/AffectationTerritoriale" + "/GetAllAffectation/" + utilisateurId + "/" + corpControleId)
            .map((res: Response) => {
                this.listeAffectationTerritoriale = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    // Récupérer la liste des ATs à partir de l'Id d'un corps de contrôle
    public GetListeATByCorpsCntrlId(idCorpsCntrl: number): Observable<Array<AffectationTerritoriale>> {
        return this.http.get(this.apiURL + "/Habilitation" + "/GetAffectationByCorpCtrlId/" + idCorpsCntrl)
            .map((res: Response) => {
                this.listeAffectationTerritoriale = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    // Supprimer une AT
    public SupprimerAffTerritoriale(idAT: number, idUser:number): Observable<Array<AffectationTerritoriale>> {
        return this.http.post(this.apiURL + "/AffectationTerritoriale" + "/SupprimerAffectation/" + idAT + "/" + idUser, {})
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public CreerAffTerritoriale(utilisateurId: number, affTerritoriale: AffectationTerritoriale): Observable<boolean> {
        return this.http.post(this.apiURL + "/AffectationTerritoriale" + "/CreerAffectation/" + utilisateurId, affTerritoriale)
            .map((res: Response) => {
                var re = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error)
            );
    }

}