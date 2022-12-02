import { Injectable } from '@angular/core';
import { Item } from 'src/DataTypes/itemdatatypes/item';

@Injectable({
    providedIn: 'root',
  })

export class UtilsService {

    constructor() {}

    giveNewIdNotPartOfListItems(list: Item[]): number{
        let idToReturn = 0;
        let valueMissing = false;
        list = list.sort((a,b) => {
            if(a.id > b.id){
                return 1;
            }
            if(a.id < b.id){
                return -1;
            }
            return 0;
        });
        list.forEach((value,index,array) => {
            if(index === 0 && value.id !== 0){
                idToReturn = 0;
                valueMissing = true;
            }
            if(index + 1 >= array.length && valueMissing === false){
                idToReturn = index + 1;
            }else if(valueMissing === false){
                if(value.id + 1 !== array[index + 1].id){
                idToReturn = index + 1;
                valueMissing = true;
                }
            }
        });
        return idToReturn;
    }
};
