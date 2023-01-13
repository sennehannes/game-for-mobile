import { Component } from '@angular/core';
import { Enemy } from 'src/DataTypes/enemydatatypes/enemy';
import { EnemyService } from '../services/enemy/enemy.service';
import { PlayerService } from '../services/player/player.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ItemService } from '../services/items/item.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  activeEnemy: Enemy;
  subscrition: Subscription;
  constructor(public playerService: PlayerService,public enemyService: EnemyService, public itemService: ItemService) {
    this.newBattle();
  }

  setEnemyListeners(){
    console.log(this.activeEnemy);
    this.subscrition =  this.activeEnemy.dead.subscribe((value) => {
      if(value === true){
        this.playerService.givePlayerBattleExperience(this.activeEnemy.exsperienceGain);
        this.playerService.givePlayerItem(this.itemService.getRandomEquipmentOfRarity(this.activeEnemy.lootTable));
      }
    });
  }

  attack(){
    this.activeEnemy.damage(this.playerService.getPlayerCurrentAttack());
    this.playerService.playerDamage(this.activeEnemy.attack);
  }

  async newBattle(){
    try{
      console.log(this.activeEnemy);
      if(this.activeEnemy !== undefined){
        this.subscrition.unsubscribe();
      }
      const enemyList: Enemy[] = await this.enemyService.findEnemyByTreadLevel(this.playerService.getPlayerLevel());
      const amountOfEnemys: number = enemyList.length;
      this.activeEnemy = new Enemy(enemyList[Math.floor(Math.random() * amountOfEnemys)]);
      this.setEnemyListeners();
      this.playerService.healPlayer(this.playerService.getPlayerMaxHealth() - this.playerService.getPlayerCurrentHealth());
    }catch{
    console.log('error in new battle');
    }
  }
}
