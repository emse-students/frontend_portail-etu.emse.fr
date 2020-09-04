import { Sponsor } from '../models/sponsor.model';

export const SPONSORS_DATA: Sponsor[] = [
  {
    name: 'Bar - BXL',
    incentives: ['-1€ sur les consos (bières et softs hors jus) hors Happy Hour'],
  },
  {
    name: 'Banque - BNP Paribas',
    incentives: [
      '70€ offerts à l’ouverture d’un compte',
      'Carte VISA Gold gratuite',
      'Prêts étudiants à taux très intéressants',
    ],
  },
  {
    name: 'Auto-Ecole - Conduite Passion',
    incentives: ["Plus de 110e d'économie sur le code, passage du permis gratuit"],
  },
  {
    name: 'Livraison de courses - U Express',
    incentives: ["Livraison gratuite à la ME avec -5% sur le total à partir de 5€ d'achat"],
  },
  {
    name: 'Cours particuliers - Mymentor',
    incentives: ["Possibilité de donner des cours à partir de 20€ de l'heure"],
  },
  {
    name: 'Location de meubles - EcoLoc',
    incentives: ['10% de réduction sur le mobilier avec le code EMSE10'],
  },
  {
    name: 'Location de box - Homebox',
    incentives: [
      '20% sur les locations de box et 10% sur le Homeshop (sur présentation de la carte étudiant)',
    ],
  },
];
