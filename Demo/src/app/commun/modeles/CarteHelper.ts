export class CarteHelper {

    public constructor() { }
        public id: number;
        public  indStatut : number;
        public  nom : string;
        public prenom : string;
        public  neLe : string;
        public population : string;
        public numCarte: string;
        public numCarteFormate: string;
        public delivreeLe: string;
        public status: string;
        public motifInvalidite: string;
        public signalee: string;
        public selection: boolean;
        public copy(dest: any): CarteHelper {
            if (dest === null) {
                return null;
            }

            var carte: CarteHelper = new CarteHelper();
            this.id = dest.id;
            this.indStatut = dest.indStatut;
            this.status = dest.status;
            this.nom = dest.nom;
            this.prenom = dest.prenom;
            this.neLe = dest.NaissanceJour + "/" + dest.NaissanceMois + "/" + dest.NaissanceAnnee;
            this.population = dest.Population;
            this.delivreeLe = dest.DelivreLe;
            this.motifInvalidite = dest.MotifInvalidite;
            this.signalee = dest.signalee;
            this.numCarte = dest.numCarte;
            this.numCarteFormate = dest.numCarteFormate;
            this.selection = dest.selection === "Yes" ? true : false;
            return this;
        }
}