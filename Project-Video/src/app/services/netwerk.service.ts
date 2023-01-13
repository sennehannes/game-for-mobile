import { Network } from '@capacitor/network';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class NetwerkService {

    constructor() {}

    initializeNetwerkCheck(){
        Network.addListener('networkStatusChange', status => {
            console.log('Network status changed', status);
        });
    }

    async logCurrentNetworkStatus(){
        const status = await Network.getStatus();
        console.log('Network status:', status);
    };

    async isConnected(): Promise<boolean>{
        this.logCurrentNetworkStatus();
        const status = await Network.getStatus();
        return status.connected;
    }
};
