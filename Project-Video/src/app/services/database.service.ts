import {
    collection,
    CollectionReference,
    Firestore,
    doc,
    DocumentReference,
    addDoc,
    collectionData,
    query,
    updateDoc,
    orderBy,
    where,
    getDocs
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Ability } from 'src/DataTypes/itemdatatypes/ability';
import { Observable,Subscription } from 'rxjs';
import { Player } from 'src/DataTypes/playerdatatypes/player';
import { Item,IItem } from 'src/DataTypes/itemdatatypes/item';
import { cloneDeep } from 'lodash';
import { promise } from 'protractor';
import { Enemy } from 'src/DataTypes/enemydatatypes/enemy';

@Injectable({
    providedIn: 'root'
})

export class DatabaseService {
//#region Converters for firebase
    #itemConverter = {
        toFirestore: (item: Item) => {
            item = {
                name: item.name,
                id: item.id,
                rarity: item.rarity,
                propertys: {
                    slot: item.propertys.slot,
                    abilitys: item.propertys.abilitys,
                    equipedSlot: item.propertys.equipedSlot,
                    attackModifyer: item.propertys.attackModifyer,
                    defenseModifyer: item.propertys.defenseModifyer,
                    speedModifyer: item.propertys.speedModifyer,
                  },
            };
            return item;
        },
        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options);
            return ({
                name: data.name,
                id: data.id,
                rarity: data.rarity,
                propertys: {
                    slot: data.propertys.slot,
                    abilitys: data.propertys.abilitys,
                    equipedSlot: data.propertys.equipedSlot,
                    attackModifyer: data.propertys.attackModifyer,
                    defenseModifyer: data.propertys.defenseModifyer,
                    speedModifyer: data.propertys.speedModifyer,
                  }});
        }
    };

    #enemyConverter = {
        toFirestore: (enemy: Enemy) => {
            enemy = {
                name: enemy.name,
                id: enemy.id,
                maxHealth: enemy.maxHealth,
                currentHealth: enemy.currentHealth,
                defense: enemy.defense,
                attack: enemy.attack,
                treadLevel: enemy.treadLevel,
                exsperienceGain: enemy.exsperienceGain,
                lootTable: enemy.lootTable,
                speed: enemy.speed
            };
            return enemy;
        },
        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options);
            return ({
                name: data.name,
                id: data.id,
                maxHealth: data.maxHealth,
                currentHealth: data.currentHealth,
                defense: data.defense,
                attack: data.attack,
                treadLevel: data.treadLevel,
                exsperienceGain: data.exsperienceGain,
                lootTable: data.lootTable,
                speed: data.speed
            });
        }
    };
//#endregion
    #subscrition: Subscription;
    constructor( private fireStore: Firestore) {}
//#region Refs
    #getCollectionRef<T>(collectionName: string): CollectionReference<T> {
        return collection(this.fireStore, collectionName) as CollectionReference<T>;
    }

    #getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
        return doc(this.fireStore, `${collectionName}/${id}`) as DocumentReference<T>;
    }
//#endregion
//#region AddTo
    async addToCollections<T>(collectionName: string, data: any ): Promise<void> {
        await addDoc<T>(
          this.#getCollectionRef<T>(collectionName),
          data
        );
        console.log('data added to database');
    }
//#endregion
//#region DataCollection
    //#region PlayerDataCollection
    retrievePlayers(collectionName: string): Observable<Player[]> {
        const players = collectionData<Player>(
            query<Player>(
                this.#getCollectionRef(collectionName),
                orderBy('id', 'asc')
            ),
            {idField: 'documentid'}
        );
        return players;
    }

    retrievePlayerByName(collectionName: string, playerName: string): Observable<Player[]>{
        const players = collectionData<Player>(
            query<Player>(
                this.#getCollectionRef(collectionName),
                where('name','==', playerName)
            ),
            {idField: 'documentid'}
        );
        return players;
    }
//#endregion

    //#region ItemDataCollection
    retrieveItemById(collectionName: string,id: number): Observable<Ability[]> {
        return collectionData<Ability>(
            query<Ability>(
                this.#getCollectionRef(collectionName),
                where('id','==', id)
            ),
            {idField: 'documentid'}
        );
    }

    async retrieveItemsByRarity(collectionName: string,rarity: string): Promise<Item[]> {
        const list: Item[] = [];
        const q = query(collection(this.fireStore, 'Items').withConverter(this.#itemConverter), where('rarity', '==', rarity));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
        list.push(document.data());
        });
        return list;
    }
    //#endregion
    async retrieveEnemyByTreatlevel(collectionName: string,treatlevel: number): Promise<Enemy[]> {
        const list: Enemy[] = [];
        const q = query(collection(this.fireStore, 'enemys').withConverter(this.#enemyConverter),
            where('treadLevel', '==', treatlevel));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
        list.push(document.data());
        });
        return list;
    }
    //#region EnemeyDataCollection

    //#endregion
//#endregion
//#region UpdateCollection
    //#region PlayerUpdates
    async updatePlayer(channel: string, id: string, newPlayerData: Player): Promise<void> {
        // Note that the key is set to undefined.
        // There is no point in including it in the data because this would mean it is
        // saved twice, once in the document, and once as the document identifier.
        delete newPlayerData.id;
        await updateDoc(this.#getDocumentRef(channel, id), newPlayerData);
    }
    //#endregion
//#endregion
}
