import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { Utilisateur } from '../../modeles/Utilisateur';
import { constant } from '../../constants';
@Injectable()
export class AuthService {
    public isLoggedIn = false;
    public user: Utilisateur;
    // store the URL so we can redirect after logging in
    redirectUrl: string;
    public nbreTentativeRestant: number;
    nbreMinutesBlockageCompte: number;
    apiURL: string;

    constructor(private http: Http) {
        this.nbreMinutesBlockageCompte = constant.NBR_MIN_BLOCKAGE_COMPTE;
        this.nbreTentativeRestant = constant.NBR_TENTATIVE_PERMIS - 1;
        this.apiURL = constant.API_URL;
    }


    public checkTokenValidity(token: string): Observable<boolean> {
        return this.http.get(this.apiURL + "/Authentification" + "/CheckTokenValidity/" + token)
            .map((res: Response) => {
                this.user = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public checkLoginValidity(login: string): Observable<boolean> {
        return this.http.get(this.apiURL + "/Authentification" + "/CheckLoginValidity/" + login)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public checkUserValidity(AffectationTerritorialeID: number, Nom: string, Prenom: string, Courriel: string): Observable<boolean> {
        var h = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        var options = new RequestOptions({ headers: h });
        return this.http.post(this.apiURL + "/Authentification" + "/checkUserValidity/" + AffectationTerritorialeID+ "/" + Nom + "/" + Prenom, JSON.stringify(Courriel), options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }
    public ActivateAccount(login: string, mdp: string): Observable<boolean> {
        var objectToSend = JSON.stringify(mdp);
        var h = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        var options = new RequestOptions({ headers: h });
        let urlSearchParams = new URLSearchParams();
        // urlSearchParams.append('username', username);
        urlSearchParams.append('mdp', mdp);
        //return this.http.post(this.apiURL + "/Authentification" + "/ActivateAccount/" + login + "/" + mdp, mdp, options)
        return this.http.post(this.apiURL + "/Authentification" + "/ActivateAccount/" + login, JSON.stringify(mdp), options)
            .map((res: Response) => {
                this.user = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    /*
   ** Authentifier un utilisateur
   */
    public authentifier(username: string, password: string): Observable<Utilisateur> {
        var h = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        var options = new RequestOptions({ headers: h });
        return this.http.post(this.apiURL + "/Authentification" + "/authentification/" + username + "/" + this.nbreMinutesBlockageCompte, JSON.stringify(password), options)
            .map((res: Response) => {
                this.user = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }
    public login(): Observable<boolean> {
        return this.http.get(this.apiURL)
            // ...and calling .json() on the response to return data
            .map((res: Response) => { Observable.of(true).delay(1000).do(val => this.isLoggedIn = true); })
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    public logout(): void {
        this.isLoggedIn = false;
        this.redirectUrl = "";
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body: any = error.json() || "";
            const err: any = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}