import { Component } from '@angular/core';
import { PlayerService } from '../services/player/player.service';
import { slots } from 'src/DataTypes/itemdatatypes/slots';
import { IonReorderGroup } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';
import { rarity } from 'src/DataTypes/itemdatatypes/rarity';
import { ItemService } from '../services/items/item.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  slots = slots.keys();
  raritys = rarity.keys();
  #filterType: string;
  constructor(public playerService: PlayerService, public itemService: ItemService) {}

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.playerService.updateItems(ev.detail.complete(this.playerService.getAllPlayerBackpacktems()));
  }
  handleFilterSelection(ev){
    this.#filterType = ev.detail.value;
  }
  getFilter(): string{
    if(this.#filterType === undefined)
    {
      return 'None';
    }else{
      return this.#filterType;
    }
  }
}
