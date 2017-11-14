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
@Injectable()
export class SessionCntrlService {
    apiURL: string = constant.API_URL;
    public currentSessionCntrl: SessionControle;
    constructor(private http: Http) {
    }

    /*
   ** Authentifier un utilisateur
   */
    public GetAllSessionCntrlByUserId(userId: number): Observable<Array<SessionControle>> {
        return this.http.get(this.apiURL + "/SessionCntrl" + "/GetAllSessionCntrlByUserId/" + userId)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }


    public getSessionCntrlById(idSession: number): Observable<SessionControle> {
        return this.http.get(this.apiURL + "/SessionCntrl" + "/GetSessionCntrlById/" + idSession)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public checkExist(idUser: number, refSession: string): Observable<SessionControle> {
        var h = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        var options = new RequestOptions({ headers: h });
        return this.http.post(this.apiURL + "/SessionCntrl" + "/CheckExisteSessionCntrl/" + idUser, JSON.stringify(refSession), options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public getListeCartesSessionCntrl(idSession: number): Observable<Array<Carte>> {
        return this.http.get(this.apiURL + "/SessionCntrl" + "/GetListeCartesSessionCntrl/" + idSession)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public updateSessionCntrl(session: SessionControle): Observable<boolean> {
        var objectToSend = JSON.stringify(session);
        var h = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        var options = new RequestOptions({ headers: h });
        return this.http.post(this.apiURL + "/SessionCntrl" + "/UpdateSessionCntrl", objectToSend, options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public supprimerCartesSessionCntrl(listeCartesToDelete: Array<number>, idSession: number): Observable<boolean> {
        var objectToSend = JSON.stringify(listeCartesToDelete);
        var h = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        var options = new RequestOptions({ headers: h });
        return this.http.post(this.apiURL + "/SessionCntrl" + "/SupprimerCartesSessionCntrl/" + idSession, objectToSend, options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public creerSessionCntrl(session: SessionControle, idUser: number): Observable<boolean> {
        var objectToSend = JSON.stringify(session);
        var h = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'q=0.8;application/json;q=0.9'
        });
        var options = new RequestOptions({ headers: h });
        return this.http.post(this.apiURL + "/SessionCntrl" + "/CreerSessionCntrl/" + idUser, objectToSend, options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }

    public searchCardByNum(idUser: number, sessionRef: string, cardNum: string, token: string = null): Observable<Carte> {
        return this.http.get(this.apiURL + "/SessionCntrl" + "/SearchCard/" + idUser + "/" + sessionRef + "/" + cardNum + "/" + token)
            .map((res: Response) => {
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error)
            );
    }
}