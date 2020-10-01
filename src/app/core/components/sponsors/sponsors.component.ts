import { Component, OnInit } from '@angular/core';
import { SPONSORS_DATA } from '../../data/sponsors.data';
import { Sponsor } from '../../models/sponsor.model';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss'],
})
export class SponsorsComponent implements OnInit {
  sponsors: Sponsor[] = SPONSORS_DATA;

  constructor() {}

  ngOnInit() {}
}
