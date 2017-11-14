import { Profil } from '../modeles/Profile'
import { AffectationTerritoriale } from '../modeles/AffectationTerritoriale';
/**
  * Représente une classe pour authentifier un utilisateur.
  */
export class Utilisateur {

    /**
     * Initialiser une instance de la classe
     * @param Nom : nom
     * @param Prenom : prenom
     * @param Courriel : adresse mail
     * @param IndStatut : statut du compte 
     * @param Telephone : téléphone  du détenteur du compte
     * @param Commentaire : commentaire  sur le compte
     * @param DateInactivation : date inactivation
     * @param DateCreation : date création
     * @param DateMaj : date MAJ
     * @param IdProfil : id profil
     * @param AffectationTerritoriale : L'affectation territoriale de l'utilisateur'
     * @param Login : Le login de l'utilisateur'
     */
    public constructor(
        public ID?: number,
        public Nom?: string,
        public Prenom?: string,
        public Courriel?: string,
        public IndStatut?: number,
        public Telephone?: string,
        public Commentaire?: string,
        public DateInactivation?: Date,
        public DateCreation?: Date,
        public DateMaj?: Date,
        public Profil?: Profil,
        public AffectationTerritoriale?: AffectationTerritoriale,
        public Login?: string) {
    }

    public courrielConfirmation: string;
    public mdpConfirmation: string;
    public mdp: string;
}