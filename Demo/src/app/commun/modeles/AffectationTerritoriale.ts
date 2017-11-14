import { CorpsControle } from '../modeles/CorpsControle';

/**
  * Représente une classe pour un affectation territoriale
  */
export class AffectationTerritoriale {

    /**
     * Initialiser une instance de la classe
     * @param ID : Id de l'affectation territoriale
     * @param Libelle : Libelle de l'affectation territoriale
     * @param DateMAJ : Date de mise à jour de l'affectation territoriale
     * @param CorpsControle : Le corps de contrôle à qui rattaché l'affectation territoriale
     */
    public constructor(
        public ID?: number,
        public Libelle?: string,
        public DateMAJ?: number,
        public CorpsControle?: CorpsControle) {
    }

    public actions: string;
}