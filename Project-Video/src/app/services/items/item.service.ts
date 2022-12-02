import { Injectable } from '@angular/core';
import { Item } from 'src/DataTypes/itemdatatypes/item';
import { Ability } from 'src/DataTypes/itemdatatypes/ability';
import { slots } from 'src/DataTypes/itemdatatypes/slots';
import { rarity } from 'src/DataTypes/itemdatatypes/rarity';
import { cloneDeep } from 'lodash';
import { PlayerService } from '../player/player.service';
import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  #itemlist: Item[] = [];
  #itemAbilityList: Ability[] = [];
  openAbilityDescription = false;
  constructor(public playerService: PlayerService, public utils: UtilsService) {
    this.#itemAbilityList.push({
      name: 'harden',
      id: 1,
      description: 'Take a flat amount of less damage from every attack.',
    });
    this.#itemAbilityList.push({
      name: 'regenerative',
      id: 2,
      description: 'Regen a flat amount of HP every turn.',
    });
    this.#itemlist.push({
      name: 'dagger',
      id: undefined,
      rarity: rarity.commen,
      propertys: {
        slot: [slots.mainHand, slots.offHand],
        abilitys: [],
        equipedSlot: null,
        attackModifyer: 4,
        defenseModifyer: -1,
        speedModifyer: 2,
      },
    });
    this.#itemlist.push({
      name: 'sword',
      id: undefined,
      rarity: rarity.commen,
      propertys: {
        slot: [slots.mainHand],
        abilitys: [],
        equipedSlot: null,
        attackModifyer: 3,
        defenseModifyer: 1,
        speedModifyer: -3,
      },
    });
    this.#itemlist.push({
      name: 'cloth helmet',
      id: undefined,
      rarity: rarity.commen,
      propertys: {
        slot: [slots.helmet],
        abilitys: [],
        equipedSlot: null,
        attackModifyer: 0,
        defenseModifyer: 1,
        speedModifyer: 2,
      },
    });
    this.#itemlist.push({
      name: 'Leather shoulderPlate',
      id: undefined,
      rarity: rarity.uncommen,
      propertys: {
        slot: [slots.rightarm, slots.leftarm],
        abilitys: [
          this.findAbilityByName('harden'),
          this.findAbilityByName('regenerative'),
        ],
        equipedSlot: null,
        attackModifyer: 0,
        defenseModifyer: 5,
        speedModifyer: 0,
      },
    });
    this.#itemlist.push({
      name: 'Leather boots',
      id: undefined,
      rarity: rarity.uncommen,
      propertys: {
        slot: [slots.leftfeet, slots.rightfeet],
        abilitys: [
          this.findAbilityByName('harden'),
          this.findAbilityByName('regenerative'),
        ],
        equipedSlot: null,
        attackModifyer: 0,
        defenseModifyer: 3,
        speedModifyer: 2,
      },
    });
    this.#itemlist.push({
      name: 'Leather chestpiece',
      id: undefined,
      rarity: rarity.uncommen,
      propertys: {
        slot: [slots.chestpiece],
        abilitys: [this.findAbilityByName('harden')],
        equipedSlot: null,
        attackModifyer: 0,
        defenseModifyer: 8,
        speedModifyer: -1,
      },
    });
  }

  getRandomEquipmentOfRarity(rarityType: string): Item {
    const newItemForPlayer: Item = cloneDeep(
      this.#itemlist.filter((t) => t.rarity === rarityType)[
        Math.floor(
          Math.random() *
            this.#itemlist.filter((t) => t.rarity === rarityType).length
        )
      ]
    );
    newItemForPlayer.id = this.utils.giveNewIdNotPartOfListItems(
      this.playerService.getAllPlayerItems()
    );
    return newItemForPlayer;
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
