import { Component } from '@angular/core';
import { slots } from 'src/DataTypes/itemdatatypes/slots';
import { PlayerService } from '../services/player/player.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NetwerkService } from '../services/netwerk.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(public playerService: PlayerService, public navController: NavController, public router: Router,
     public netwerkService: NetwerkService) {
      netwerkService.initializeNetwerkCheck();
      netwerkService.logCurrentNetworkStatus();
  }
}
