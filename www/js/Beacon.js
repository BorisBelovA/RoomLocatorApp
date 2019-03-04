module.exports = class Beacon {
    constructor(UID,BID,RSSI,TxPower){
        this.UID = UID;
        this.BID = BID;
        this.RSSI = RSSI;
        this.TxPower = TxPower;
        this.data = [];
        this.data.push(RSSI);
        this.filtered_data = [];
        this.timeStamp = Date.now();
        this.distance = null;
    };

    getUID(){
        return this.UID;
    }

    getTxPower(){
        return this.TxPower;
    }

    getRSSI(){
        return this.RSSI;
    }

    setRSSI(rssi){
        this.RSSI = rssi;
    }
    
   /* setRSSI(rssi){
        this.RSSI = rssi;
    }*/

    getData(){
        return this.data;
    }

    setData(data_arr){
        this.data = data_arr;
    }

    getTimeStamp(){
        return this.timeStamp;
    }

    appendData(rssi){
        let temp = this.getData();
        temp.push(rssi);
        this.data = temp;
    }

    getFilteredData(){
        return this.filtered_data;
    }

    appendFilteredData(filtered_rssi){
        /*let temp = this.getFilteredData();
        temp.push(filtered_rssi);*/
        this.filtered_data = filtered_rssi;
    }
    
    setTimeStamp(timeStamp){
        this.timeStamp = timeStamp
    }
    
    generateData(){
        let generated_data = parseInt(Math.random() * (60 - 40) + 40);
        return generated_data;
    }
    getDistance(){
        return this.distance;
    }
    
    setDistance(distance){
        this.distance = distance
    }
}

