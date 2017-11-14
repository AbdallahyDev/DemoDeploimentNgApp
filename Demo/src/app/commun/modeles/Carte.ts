export class Carte {

    public constructor(
        public ID: number,
        public NumCarte: number,
        public  IndStatut : number,
        public  NomNaissance : string,
        public  NomUsage : string,
        public Prenom1 : string,
        public  Prenom2 : string,
        public Prenom3 : string,
        public  Sexe : string,
        public  CommuneNaissance : string,
        public Nationalite1: string,
        public Nationalite2: string,
        public NumCarteSejour: string,
        public  NumFichierPhoto : number,
        public TypeContratTravail: string,
        public  DateFinContratTravail : Date,
        public NaissanceJour: string,
        public NaissanceMois: string,
        public NaissanceAnnee: string,
        public  DelivreLe : Date,
        public  IndValide : number,
        public MotifInvalidite: string,
        public Population : string
        ) {

    }
}