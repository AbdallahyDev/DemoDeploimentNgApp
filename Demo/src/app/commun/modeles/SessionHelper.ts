export class SessionHelper {
    date: string;
    reference: string;
    idChantier: string;
    etat: string;
    selection: boolean;
    actions: string;
    id: number;
    public copy(dest: any): SessionHelper{
        if (dest===null){
            return null;
        }
        this.date = dest.date;
        this.etat = dest.etat;
        this.idChantier = dest.idChantier;
        this.id = dest.id;
        this.reference = dest.reference;
        this.selection = dest.selection === "Yes" ? true : false;
        return this;
    }

}