/**
  * Représente une classe pour authentifier un utilisateur.
  */
export class UtilisateurHelper {
    
    /**
     * Initialiser une instance de la classe
     * @param Nom : nom
     * @param Prenom : prenom
     * @param Courriel : adresse mail
     * @param IndStatut : statut du compte 
     * @param DateInactivation : date inactivation
     * @param DateCreation : date création
     * @param DateMaj : date MAJ
     * @param Profil :  profil
     * @param AffectationTerritoriale : L'affectation territoriale de l'utilisateur'
     */
    public constructor(
        public ID? : number,
        public Nom? : string,
        public Prenom? : string,
        public Courriel?: string,
        public Statut? : string,
        public DateInactivation? : Date,
        public DateCreation? : Date,
        public DateMaj? : Date,
        public Profil?: string,
        public actions?: string,
        public AffectationTerritoriale?: string ) {
    }
}