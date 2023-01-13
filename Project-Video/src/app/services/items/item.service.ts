import { Injectable } from '@angular/core';
import { Item } from 'src/DataTypes/itemdatatypes/item';
import { Ability } from 'src/DataTypes/itemdatatypes/ability';
import { slots } from 'src/DataTypes/itemdatatypes/slots';
import { rarity } from 'src/DataTypes/itemdatatypes/rarity';
import { cloneDeep } from 'lodash';
import { PlayerService } from '../player/player.service';
import { UtilsService } from '../utils.service';
import { DatabaseService } from '../database.service';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  #itemAbilityList: Ability[] = [];
  openAbilityDescription = false;
  constructor(public playerService: PlayerService, public utils: UtilsService,private dbServic: DatabaseService) {
    this.#itemAbilityList.push({
      name: 'harden',
      id: 1,
      description: 'Take a flat amount of less damage from every attack.',
    });
    this.#itemAbilityList.push({
      name: 'regenerate',
      id: 2,
      description: 'Regen a flat amount of HP every turn.',
    });
  }

  async getRandomEquipmentOfRarity(rarityType: string): Promise<Item> {
    try{
      const result = await this.dbServic.retrieveItemsByRarity('Items', rarityType);
      const newItemForPlayer: Item =
        result.filter((t) => t.rarity === rarityType)[
          Math.floor(Math.random() * result.filter((t) => t.rarity === rarityType).length)
        ];
        newItemForPlayer.id = this.utils.giveNewIdNotPartOfListItems(
        this.playerService.getAllPlayerItems()
        );
        return newItemForPlayer;
    }catch(err: any){
      console.log('error in getRandomEquipmentOfRarity');
    }
  }

  /**
   * find the ability datatype of the given ability name.
   *
   * @param abilityName
   * input string (abilityname).
   *
   * @returns
   * ability (Ability)
   */
  findAbilityByName(abilityName: string): Ability {
    return this.#itemAbilityList.find((t) => t.name === abilityName);
  }

  showItemAbilityDescription(show: boolean, ability?: Ability) {
    this.openAbilityDescription = show;
    if (ability !== undefined) {
      this.playerService.selectedAbility = this.#itemAbilityList.find(
        (t) => t.id === ability.id
      );
    }
  }
}
