import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class SharedService {
    // Observable string sources
    private emitChangeMsg = new Subject<any>();
    private emitChangeUserID = new Subject<any>();
    private emitChangeListeCorpsCntrl = new Subject<any>();
    private emitChangeListeHabilitation = new Subject<any>();
    private emitChangeListeAT = new Subject<any>();

    // Observable string streams
    changeEmitted$ = this.emitChangeMsg.asObservable();

    // Service message commands
    emitChange(change: any) {
        this.emitChangeMsg.next(change);
    }

    // Observable string streams
    userIDChangeEmitted = this.emitChangeUserID.asObservable();

    // Service message commands
    emitUserIDChange(change: any) {
        this.emitChangeUserID.next(change);
    }

    // Observable liste de corps de contrôle
    listeCorpsCntrlChangeEmitted = this.emitChangeListeCorpsCntrl.asObservable();

    // Service message commands
    emitListeCorpsCntrlChange(change: any) {
        this.emitChangeListeCorpsCntrl.next(change);
    }

    // Observable liste de corps de contrôle
    listeHabilitationChangeEmitted = this.emitChangeListeHabilitation.asObservable();

    // Service message commands
    emitListeHabilitationChange(change: any) {
        this.emitChangeListeHabilitation.next(change);
    }

    // Observable liste de AT
    listeATChangeEmitted = this.emitChangeListeAT.asObservable();

    // Service message commands
    emitListeATChange(change: any) {
        this.emitChangeListeAT.next(change);
    }

}