import { Item } from '../itemdatatypes/item';
import { Ability } from './abilitys';

export interface IPlayer {
    name: string;
    id: number;
    items?: Item[];
    maxHealth: number;
    currentHealth: number;
    defense: number;
    attack: number;
    experience: number;
    level: number;
    speed: number;
    equipedAbilitys: Ability[];
    usableAbilitys: Ability[];
  }

  export class Player {
    name: string;
    id: number;
    items?: Item[];
    maxHealth: number;
    currentHealth: number;
    defense: number;
    attack: number;
    experience: number;
    level: number;
    speed: number;
    equipedAbilitys: Ability[];
    usableAbilitys: Ability[];
    constructor(obj: IPlayer) {
      Object.assign(this, obj);
    }
  }
