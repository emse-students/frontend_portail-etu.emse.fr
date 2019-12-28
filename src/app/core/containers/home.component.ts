import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <mat-card>
      <mat-card-title>Bienvenue sur Portail-etu</mat-card-title>
      <mat-card-content>
        <p>
          Vous y trouverez l'historique de vos paiements en compte BDE, la description de vos assos
          préférées et l'ensemble des événements qu'elles organisent.
          <br />
          Les événements sont disponibles dans un calendrier interactif qui vous permets de vous y
          inscrire et de les payer directement en ligne.
        </p>
      </mat-card-content>
    </mat-card>
    <app-calendar-container></app-calendar-container>
    <mat-card>
      <mat-card-content>
        <p>
          Le site est en cours de développement, merci de signaler à
          <a href="corentin.doue@etu.emse.fr">corentin.doue@etu.emse.fr</a>
          si vous rencontrez des bugs afin qu'ils soient corrigés
        </p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  ngOnInit() {}
}
