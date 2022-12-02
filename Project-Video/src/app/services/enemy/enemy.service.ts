import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Enemy } from 'src/DataTypes/enemydatatypes/enemy';
import { rarity } from 'src/DataTypes/itemdatatypes/rarity';

@Injectable({
  providedIn: 'root',
})
export class EnemyService {
  #enemyList: Enemy[] = [];
  constructor() {
    this.#enemyList.push(
      new Enemy({
        name: 'goblin',
        id: 1,
        maxHealth: 10,
        currentHealth: new BehaviorSubject<number>(10),
        defense: 2,
        attack: 2,
        speed: 3,
        treadLevel: 1,
        exsperienceGain: 30,
        lootTable: rarity.commen,
      })
    );
    this.#enemyList.push(
      new Enemy({
        name: 'kobold',
        id: 2,
        maxHealth: 15,
        currentHealth: new BehaviorSubject<number>(15),
        defense: 1,
        attack: 3,
        speed: 4,
        treadLevel: 1,
        exsperienceGain: 40,
        lootTable: rarity.uncommen,
      })
    );
    this.#enemyList.push(
      new Enemy({
        name: 'bandit',
        id: 3,
        maxHealth: 50,
        currentHealth: new BehaviorSubject<number>(50),
        defense: 7,
        attack: 5,
        speed: 0,
        treadLevel: 2,
        exsperienceGain: 100,
        lootTable: rarity.uncommen,
      })
    );
  }

  getEnemyByName(enemyName: string): Enemy {
    return this.#enemyList.find((t) => t.name === enemyName);
  }

  findEnemyByTreadLevel(tread: number): Enemy[] {
    return this.#enemyList.filter((t) => t.treadLevel === tread);
  }

  resetEnemy(enemy: Enemy) {
    const enemyToReset: Enemy = this.#enemyList.find((t) => t === enemy);
    enemyToReset.currentHealth.next(enemyToReset.maxHealth);
  }
}
