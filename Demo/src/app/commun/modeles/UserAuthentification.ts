/**
  * Représente une classe pour authentifier un utilisateur.
  */
export class UserAuthentification {

    public username: string;
    public password: string
    /**
     * Initialiser une instance de la classe
     * @param username : login de l'utilisateur
     * @param password : mot de passe de l'utilisateur
     */
    //public constructor(public username: string, public password: string) {
    //    this.username = "";
    //    this.password = "";
    //}

    public constructor() {
        this.username = "";
        this.password = "";
    }
}