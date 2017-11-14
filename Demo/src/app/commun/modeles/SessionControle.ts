/**
  * Représente une classe pour authentifier un utilisateur.
  */
export class SessionControle {

    /**
     * Initialiser une instance de la classe
     * @param ID : ID d'une session'
     * @param Reference : référence d'une session
     * @param ReferenceChantier : référence du chantier
     * @param AdresseChantier : adresse du chantier
     * @param DescriptionChantier : desciption du chantier
     * @param IndEtat : état de la session. 1 :en cours, 0 : clôturee
     * @param DateCreation : date création
     * @param DateMAJ : date MAJ
     */
    public constructor(
        public ID?: number,
        public Reference?: string, 
        public ReferenceChantier?: string, 
        public AdresseChantier?: string, 
        public DescriptionChantier?: string, 
        public IndEtat?: number,
        public DteCreation?: Date,
        public DteMAJ?: Date) {
    }
    
}