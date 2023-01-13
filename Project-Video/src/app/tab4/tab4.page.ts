import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../services/player/player.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  loginName: string;
  loginWachtwoord: string;
  constructor(public playerService: PlayerService) { }

  ngOnInit() {
  }

}
