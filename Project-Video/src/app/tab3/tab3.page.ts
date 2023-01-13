import { Component } from '@angular/core';
import { PlayerService } from '../services/player/player.service';
import { slots } from 'src/DataTypes/itemdatatypes/slots';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  constructor(public playerService: PlayerService) {

  }
}
