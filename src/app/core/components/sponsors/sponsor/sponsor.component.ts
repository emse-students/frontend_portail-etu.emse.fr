import { Component, OnInit, Input } from '@angular/core';
import { Sponsor } from 'src/app/core/models/sponsor.model';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
})
export class SponsorComponent implements OnInit {
  @Input() sponsor: Sponsor;

  constructor() {}

  ngOnInit() {}
}
