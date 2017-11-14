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
import { Utilisateur } from '../../modeles/Utilisateur';
import { Profil } from '../../modeles/Profile';

@Injectable()
export class HabilitationService {
    apiURL: string = constant.API_URL;
    public listeHabilitation: Array<Utilisateur>;
    constructor(private http: Http) {
    }

    /*
   ** Récupérer la liste des habilitations
   */
    public GetAllHabByUserId(utilisateurId: number, corpControleId: number): Observable<Array<Utilisateur>> {
        return this.http.get(this.apiURL + "/Habilitation" + "/GetAllHabilitation/" + utilisateurId + "/" + corpControleId)
            .map((res: Response) => {
                this.listeHabilitation = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public SupprimerHabilitation(habId: number, userId: number): Observable<Array<Utilisateur>> {
        return this.http.post(this.apiURL + "/Habilitation" + "/SupprimerHabilitation/" + habId + "/" + userId, {})
            .map((res: Response) => {
                var re = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }


    public RenvoyerEmailActivation(habId: number, utilisateurId: number): Observable<Array<Utilisateur>> {
        return this.http.get(this.apiURL + "/Habilitation" + "/SendActivationMail/" + habId + "/" + utilisateurId)
            .map((res: Response) => {
                var re = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error)
            );
    }

    public CreerHabilitation(utilisateurId: number, habilitation: Utilisateur): Observable<boolean> {
        return this.http.post(this.apiURL + "/Habilitation" + "/CreerHabilitation/" + utilisateurId, habilitation)
            .map((res: Response) => {
                var re = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error)
            );
    }

    public getAllProfils(): Observable<Array<Profil>> {
        return this.http.get(this.apiURL + "/Habilitation" + "/GetAllProfile/")
            .map((res: Response) => {
                var re = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }
}