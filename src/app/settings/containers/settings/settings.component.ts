import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Setting, SETTINGS, strIdToTabId } from '../../models/settings.models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settings: Setting[];
  selectedSetting: number;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.settings = SETTINGS;
    this.route.paramMap.subscribe(params => {
      this.selectedSetting = strIdToTabId(params.get('id'));
    });
  }

  goTo(strId: string) {
    this.router.navigate(['/settings', strId]);
  }
}
