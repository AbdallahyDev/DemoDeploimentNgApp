/**
  * Représente une classe pour authentifier un utilisateur.
  */
export class Profil {

    /**
     * Initialiser une instance de la classe
     * @param ID :  id du profile
     * @param code : code du profile
     * @param Libelle : libelle du profile
     * @param Niveau : niveau de droit du profile
     * @param Description : description du profile
     */
    public constructor(
        public ID: number,
        public Code: string,
        public Libelle: string,
        public Niveau: number,
        public Description: string) {
    }
}