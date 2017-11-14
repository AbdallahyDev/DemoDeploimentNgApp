export namespace constant {
    export const USER_NOTFOUND: string = 'Identifiant inconnu';
    export const USER_DESACTIVATED: string = 'Identifiant inactivé  le';
    export const USER_PWDNOMATCH: string = 'Mot de passe incorrect';
    export const USER_PWDEXPIRED: string = 'Le mot de passe a expiré';
    export const USER_BLOCKED: string = 'Mot de passe incorrect';
    export const USER_BLOCKED_TIME_STAYING: string = 'Votre compte est bloqué, il va être débloqué dans';
    export const NBR_MIN_BLOCKAGE_COMPTE: number = 20;
    export const NBR_TENTATIVE_PERMIS: number = 3;
    export const API_URL: string = "http://localhost:59260/api"; 
    export const REF_SESSION_LENGTH: number = 20;
    export const NUMBER_ELEMENTS_PER_PAGE: number = 4;
    export const TIME_FOR_SHOWING_MSG_INF: number = 4000; // par défaut à 4s
}