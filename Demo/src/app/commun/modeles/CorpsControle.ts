/**
  * Représente une classe pour un CorpsControle
  */
export class CorpsControle {

    /**
     * Initialiser une instance de la classe
     * @param ID : Id du corps du contrôle
     * @param Libelle : libelle du corps du contrôle
     * @param IndAuthentUserPwd : Indicteur, indiquant si un corps de contrôle utilise l'authentificatrion par login/m^p ou non
     */
    public constructor(
        public ID: number,
        public Libelle: string,
        public IndAuthentUserPwd: boolean) {
    }
}