import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from '../database.service';
import { Enemy } from 'src/DataTypes/enemydatatypes/enemy';
import { rarity } from 'src/DataTypes/itemdatatypes/rarity';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class EnemyService {
  #enemyList: Enemy[] = [];
  constructor(private dbServic: DatabaseService) {
    this.#enemyList.push({
        name: 'goblin',
        id: 1,
        maxHealth: 10,
        currentHealth: 10,
        defense: 2,
        attack: 2,
        speed: 3,
        treadLevel: 1,
        exsperienceGain: 30,
        lootTable: rarity.commen,
      }
    );
    this.#enemyList.push(
      {
        name: 'kobold',
        id: 2,
        maxHealth: 15,
        currentHealth: 15,
        defense: 1,
        attack: 3,
        speed: 4,
        treadLevel: 1,
        exsperienceGain: 40,
        lootTable: rarity.uncommen,
      }
    );
    this.#enemyList.push(
      {
        name: 'bandit',
        id: 3,
        maxHealth: 50,
        currentHealth: 50,
        defense: 7,
        attack: 5,
        speed: 0,
        treadLevel: 2,
        exsperienceGain: 100,
        lootTable: rarity.uncommen,
      }
    );
  }

  getEnemyByName(enemyName: string): Enemy {
    return this.#enemyList.find((t) => t.name === enemyName);
  }

  async findEnemyByTreadLevel(tread: number): Promise<Enemy[]> {
    try{
      const enemys = await this.dbServic.retrieveEnemyByTreatlevel('enemys',tread);
      return enemys;
    }catch{
      console.log('error in find enemy by treat level');
    }
  }
}
