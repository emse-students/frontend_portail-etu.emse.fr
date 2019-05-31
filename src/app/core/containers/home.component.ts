import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <mat-card>
      <mat-card-title>Bienvenue sur Portail-etu</mat-card-title>
      <mat-card-content>
        <div>
          <p>
            Ce site a pour vocation de remplacer l'ancien site du BDE.
            <br />
            Vous y retrouverez l'historique de votre compte BDE. Mais de nouvelles fonctionnalités
            sont disponibles :
          </p>
          <ul>
            <li>La description de toutes les assos (plaquette alpha en ligne)</li>
            <li>La gestion de tous les évènements des assos de l'école</li>
            <li>
              L'inscription en ligne aux évènements (permet après de savoir si on est déjà inscrit)
            </li>
            <li>
              Paiement en ligne des événements avec le compte BDE en même temps que l'inscription
            </li>
            <li>
              Paiement en ligne des événements avec le compte Cercle en même temps que l'inscription
            </li>
          </ul>
          <p>A venir :</p>
          <ul>
            <li>
              Calendrier interactif (le même que celui envoyé par le BDE mais mis à jour au fur et à
              mesure que les évènements sont créés)
            </li>
          </ul>
          <p>
            Le site est en cours de développement, merci de signaler à
            <a href="corentin.doue@etu.emse.fr">corentin.doue@etu.emse.fr</a>
            si vous rencontrez des bugs afin qu'ils soient corrigés
          </p>
        </div>
      </mat-card-content>
    </mat-card>
    <app-calendar-container></app-calendar-container>
  `,
  styles: [
    `
      mat-card-title,
      mat-card-content,
      mat-card-footer {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
