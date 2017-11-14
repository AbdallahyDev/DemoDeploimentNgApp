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
import { CorpsControle } from '../../modeles/CorpsControle';

@Injectable()
export class CorpsControleService {
    apiURL: string = constant.API_URL;
    public listeCorpsControle: Array<CorpsControle>;
    constructor(private http: Http) {
    }

    /*
   ** Récupérer la liste des CorpsControle
   */
    public GetAllCorpsControle(): Observable<Array<CorpsControle>> {
        return this.http.get(this.apiURL + "/Habilitation" + "/GetAllCorpControle/")
            .map((res: Response) => {
                this.listeCorpsControle = res.json();
                return res.json();
            })
            .catch(
            (error: any) =>
                Observable.throw(error.json())
            );
    }
    
}