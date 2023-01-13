import { BehaviorSubject } from 'rxjs';
import { Item } from '../itemdatatypes/item';

export interface IEnemy {
    name: string;
    id: number;
    maxHealth: number;
    currentHealth: number;
    defense: number;
    attack: number;
    dead?: BehaviorSubject<boolean>;
    currentHealthBehavior?: BehaviorSubject<number>;
    treadLevel: number;
    exsperienceGain: number;
    lootTable: string;
    speed: number;
}

export class Enemy {
    name: string;
    id: number;
    maxHealth: number;
    currentHealth: number;
    defense: number;
    attack: number;
    dead?: BehaviorSubject<boolean>;
    currentHealthBehavior?: BehaviorSubject<number>;
    treadLevel: number;
    exsperienceGain: number;
    lootTable: string;
    speed: number;
    constructor(obj: IEnemy) {
        this.currentHealthBehavior = new BehaviorSubject<number>(obj.currentHealth);
        this.dead = new BehaviorSubject<boolean>(false);
        Object.assign(this, obj);
        this.currentHealth = this.currentHealthBehavior.value;
        this.currentHealthBehavior.subscribe((value) => {
            this.currentHealth = this.currentHealthBehavior.value;
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
        this.currentHealthBehavior.next(this.currentHealthBehavior.value - damage);
    }
    getEnemyHealthPercentage?(): number{
        return this.currentHealthBehavior.value/this.maxHealth;
    }
}
