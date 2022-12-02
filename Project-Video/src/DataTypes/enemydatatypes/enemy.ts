import { BehaviorSubject } from 'rxjs';
import { Item } from '../itemdatatypes/item';

export interface IEnemy {
    name: string;
    id: number;
    maxHealth: number;
    currentHealth: BehaviorSubject<number>;
    defense: number;
    attack: number;
    dead?: boolean;
    treadLevel: number;
    exsperienceGain: number;
    lootTable: string;
    speed: number;
}

export class Enemy {
    name: string;
    id: number;
    maxHealth: number;
    currentHealth: BehaviorSubject<number>;
    defense: number;
    attack: number;
    dead?: BehaviorSubject<boolean>;
    treadLevel: number;
    exsperienceGain: number;
    lootTable: string;
    speed: number;
    constructor(obj: IEnemy) {
        this.dead = new BehaviorSubject<boolean>(false);
        Object.assign(this, obj);
        this.currentHealth.subscribe((value) => {
            if(value <= 0){
                if(this.dead.value !== true){
                    this.dead.next(true);
                }
            }else{
              this.dead.next(false);
            }
        });
    }
    damage?(damage: number){
        this.currentHealth.next(this.currentHealth.value - damage);
    }
    getEnemyHealthPercentage?(): number{
        return this.currentHealth.value/this.maxHealth;
    }
}
