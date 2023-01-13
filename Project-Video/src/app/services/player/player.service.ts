import { Injectable } from '@angular/core';
import { Ability } from 'src/DataTypes/itemdatatypes/ability';
import { Item } from 'src/DataTypes/itemdatatypes/item';
import { rarity } from 'src/DataTypes/itemdatatypes/rarity';
import { slots } from 'src/DataTypes/itemdatatypes/slots';
import { Player } from 'src/DataTypes/playerdatatypes/player';
import {from, Observable, of, Subscription} from 'rxjs';
import { DatabaseService } from '../database.service';
import { cloneDeep } from 'lodash';
import { NetwerkService } from '../netwerk.service';


@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  #loggedInplayer: Player;
  #subscrition: Subscription;
  #selectedItem: Item;
  selectedAbility: Ability;
  constructor(private dbServic: DatabaseService,private netwerkService: NetwerkService ) {}

  updateCurrentPlayer(){
    const connection = this.netwerkService.isConnected();
    connection.then((t) => {
      if(t === true){
        this.dbServic.updatePlayer('players',this.#loggedInplayer.documentid,this.#loggedInplayer);
      }else
      {
        console.log('disconected');
      }
    });
  }
  /**
   *login the given player.
   *
   * @param playerName
   * input string (playername).
   */
  loginPlayer(playerName: string,playerWachtwoord: string){
    this.dbServic.retrievePlayerByName('players', playerName).forEach(x => {
      if (x.find((t) => t.name === playerName) !== undefined){
        if(x.find((t) => t.name === playerName).wachtwoord === playerWachtwoord){
          this.#loggedInplayer = x.find((t) => t.name === playerName);
        }
      }
    });
  }

  registerPlayer(playerName: string,playerWachtwoord: string){
    if(this.dbServic.retrievePlayerByName('players',playerName) === null){
      const player = {
        name: playerName,
        id: 3,
        wachtwoord: playerWachtwoord,
        items: [],
        maxHealth: 20,
        currentHealth: 20,
        defense: 0,
        attack: 2,
        experience: 0,
        level: 1,
        speed: 0,
        equipedAbilitys: [],
        usableAbilitys: []
      };
      this.dbServic.addToCollections<Player>('players',player);
    }
  }

  /**
   * loggout the currently logged in player
   */
  loggoutPlayer(){
    this.updateCurrentPlayer();
    this.#subscrition.unsubscribe();
    this.#loggedInplayer = undefined;
  }

  /**
   * check if a player is logged in.
   *
   * @returns
   * true if player is logged in otherwhise return false
   */
  playerLoggedIn(){
    if(this.#loggedInplayer === undefined){
      return false;
    }else{
      return true;
    }
  }

  /**
   * return all items of the given rarity
   *
   * @param givenRarity
   * input string (rarity)
   *
   * @return
   * array of items (Item).
   */
  getAllItemsOfRarity(givenRarity: string) {
    const itemListUnequiped = this.getAllPlayerBackpacktems();
    return itemListUnequiped.filter((t) => t.rarity === givenRarity);
  }

  /**
   * get all items of the given slot that are currently unequiped
   *
   * @param slot
   * input string (slot)
   *
   * @return
   * array of items (Item).
   */
  getAllItemsOfSlot(slot: string): Item[] {
    const itemListUnequiped = this.getAllPlayerBackpacktems();
    return itemListUnequiped.filter((t) => t.propertys.slot.includes(slot));
  }
  /**
   * get all items currently in the logged in players backpack
   *
   * @returns
   * array of items (Item).
   */
  getAllPlayerBackpacktems(): Item[] {
    const itemListUnequiped = this.#loggedInplayer.items.filter(
      (t) => t.propertys.equipedSlot == null
    );
    return itemListUnequiped;
  }

  /**
   * get the currently logged in players name
   *
   * @returns
   * string containing the name
   *
   * if no player is logged in return string containing 'none'
   */
  getPlayerName(): string {
    if(this.#loggedInplayer !== undefined){
      return this.#loggedInplayer.name;
    }else{
      return 'none';
    }
  }

  givePlayerItem(newItem: Promise<Item>) {
    newItem
      .then((result: Item) => {
        this.#loggedInplayer.items.push(cloneDeep(result));
        console.log(this.#loggedInplayer);
        this.updateCurrentPlayer();
      })
      .catch((err: Error) => console.log('error in giving player a item'));
  }

  getPlayerLevel(): number {
    return this.#loggedInplayer.level;
  }

  getPlayerCurrentExsperience(): number {
    return this.#loggedInplayer.experience;
  }

  getAllPlayerItems(): Item[]{
    return this.#loggedInplayer.items;
  }

  givePlayerBattleExperience(experience: number){
    this.#loggedInplayer.experience += experience;
    this.updateCurrentPlayer();
  }
  getAllEquipedItems(): Item[]{
    const equipedItems = this.#loggedInplayer.items.filter((t) => t.propertys.equipedSlot !== null);
    return equipedItems;
  }

  removeItemFromBackpack(itemId: number){
    this.#loggedInplayer.items.splice(this.#loggedInplayer.items.indexOf(this.#loggedInplayer.items.find((t) => t.id === itemId)), 1);
    this.updateCurrentPlayer();
  }

  itemHasAbilitys(item: Item): boolean{
    if(this.#loggedInplayer.items.find((t) => t === item).propertys.abilitys.length === 0){
      return false;
    }else{
      return true;
    }
  }

  getEquipedItemInSlot(slot: string): string {
    const itemListEquiped = this.#loggedInplayer.items.filter(
      (t) => t.propertys.equipedSlot != null
    );
    if (
      itemListEquiped.find((t) => t.propertys.equipedSlot === slot) ===
      undefined
    ) {
      return 'none';
    } else {
      return itemListEquiped.find((t) => t.propertys.equipedSlot === slot).name;
    }
  }

  getEquipedItemInSlotById(slot: string): number {
    const itemListEquiped = this.#loggedInplayer.items.filter(
      (t) => t.propertys.equipedSlot != null
    );
    if (
      itemListEquiped.find((t) => t.propertys.equipedSlot === slot) ===
      undefined
    ) {
      return null;
    } else {
      return itemListEquiped.find((t) => t.propertys.equipedSlot === slot).id;
    }
  }

  slotIsEquiped(slot: string): boolean {
    if (this.getEquipedItemInSlot(slot) === 'none') {
      return false;
    } else {
      return true;
    }
  }

  selectItem(itemId: number) {
    this.#selectedItem = this.#loggedInplayer.items.find((t) => t.id === itemId);
  }

  isSelected(value: Item | Ability): boolean;
  isSelected(x: any): boolean {
    if (this.#selectedItem !== undefined) {
      if (this.#selectedItem.id === x.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  unequipeItem(slot: string) {
    const equipedItem = this.#loggedInplayer.items.find(
      (t) => t.id === this.getEquipedItemInSlotById(slot)
    );
    const equipedItemIndex = this.#loggedInplayer.items.findIndex(
      (t) => t === equipedItem
    );
    equipedItem.propertys.equipedSlot = null;
    this.#loggedInplayer.items.splice(equipedItemIndex, 1, equipedItem);
    this.updateCurrentPlayer();
  }

  equipItem(slot: string) {
    if (this.#selectedItem !== undefined) {
      if (
        this.getEquipedItemInSlot(slot) === 'none' &&
        this.#selectedItem.propertys.slot.includes(slot)
      ) {
        const equipedItemIndex = this.#loggedInplayer.items.findIndex(
          (t) => t === this.#selectedItem
        );
        this.#selectedItem.propertys.equipedSlot = slot;
        this.#loggedInplayer.items = this.#loggedInplayer.items.map((t) => { if(t.id === this.#selectedItem.id)
        {
          t = this.#selectedItem;
        }
        return t;
        });
        this.#selectedItem = undefined;
        this.updateCurrentPlayer();
      }
    }
  }

  updateItems(playerItems: Item[]) {
    this.#loggedInplayer.items = playerItems;
    this.updateCurrentPlayer();
  }

  showItemAbilitys(itemId) {
    const itemAbilitys = this.#loggedInplayer.items.find((t) => t.id === itemId).propertys
      .abilitys;
    if (itemAbilitys.length === 0) {
      return ['none'];
    } else {
      const abilityNameList = [];
      itemAbilitys.forEach((ability) => {
        abilityNameList.push(ability);
      });
      return abilityNameList;
    }
  }

  showSelectedItemDescription() {
    return this.selectedAbility.description;
  }

  showSelectedItemName() {
    return this.selectedAbility.name;
  }
  getPlayerCurrentDefense() {
    let playerFullDefense: number = this.#loggedInplayer.defense;
    this.getAllEquipedItems().forEach((t) => playerFullDefense += t.propertys.defenseModifyer);
    return playerFullDefense;
  }

  getPlayerMaxHealth(){
    return this.#loggedInplayer.maxHealth;
  }

  getPlayerCurrentHealth(){
    return this.#loggedInplayer.currentHealth;
  }

  getPlayerHealthPercentage(){
    return this.#loggedInplayer.currentHealth / this.#loggedInplayer.maxHealth;
  }

  getPlayerSpeed(){
    return this.#loggedInplayer.speed;
  }

  playerDamage(damage: number){
    this.#loggedInplayer.currentHealth -= damage;
    this.updateCurrentPlayer();
  }

  getPlayerCurrentAttack() {
    let playerFullAttack: number = this.#loggedInplayer.attack;
    this.getAllEquipedItems().forEach((t) => playerFullAttack += t.propertys.attackModifyer);
    return playerFullAttack;
  }

  getPlayerCurrentSpeed() {
    let playerFullSpeed: number = this.getPlayerSpeed();
    this.getAllEquipedItems().forEach((t) => playerFullSpeed += t.propertys.speedModifyer);
    return playerFullSpeed;
  }


  returnRarityColor(itemRarity: string) {
    if (itemRarity === rarity.commen) {
      return 'commen';
    } else if (itemRarity === rarity.uncommen) {
      return 'uncommen';
    } else {
      return 'danger';
    }
  }

  healPlayer(healthpoints: number){
    this.#loggedInplayer.currentHealth += healthpoints;
    this.updateCurrentPlayer();
  }

  exsperienceNeededToLevelup(): number{
    const incrementationValue = 2;
    const exsperienceNeeded = 150 * ((1 - Math.pow(incrementationValue,this.#loggedInplayer.level))/(1 - incrementationValue));
    return exsperienceNeeded;
  }

  canLevelup(): boolean{
    if(this.#loggedInplayer.experience > this.exsperienceNeededToLevelup()){
      return false;
    }else{
      return true;
    }
  }

  levelUp(){
    this.#loggedInplayer.level += 1;
    this.updateCurrentPlayer();
  }
}
