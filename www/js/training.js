class Beacon {
    constructor(UID,RSSI,TxPower){
        this.UID = UID;
        this.RSSI = RSSI;
        this.TxPower = TxPower;
        this.data = [];
        this.data.push(RSSI);
        this.filtered_data = [];
        this.timeStamp = Date.now()
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
/*
        console.log('tsmp - ' + temp);
*/
        this.data = temp;
    }

    getFilteredData(){
        return this.filtered_data;
    }

    appendFilteredData(filtered_rssi){
        let temp = this.getFilteredData();
        temp = filtered_rssi;
        this.filtered_data = temp;
    }

    generateData(){
        let generated_data = parseInt(Math.random() * (60 - 40) + 40);
        return generated_data;
    }

    setTimeStamp(timeStamp){
        this.timeStamp = timeStamp
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#buttons').style.display = 'block';
})

function addBeacon() {
    //Инициализируем переменные
    let uid = document.querySelector('input[name="UID"]').value;
    let rssi = parseInt(document.querySelector('input[name="RSSI"]').value);
    let txPower = parseInt(document.querySelector('input[name="TxPower"]').value);
    let timeStamp = Date.now();
    //Создаем новый объект
    let beacon = new Beacon(uid,rssi,txPower);

    if(beacons[uid]===undefined){                                   //Если сигнал метки ловим впервые, то заносим ее в словарь
        beacons[uid] = beacon
    }else{                                                          //Если метка уже есть в словаре, то доплняем массив с данными RSSI
        let temp = beacons[uid];
        temp.appendData(rssi)
        temp.setTimeStamp(timeStamp);
        console.log('Temp - ' + temp)
        beacons[uid] = temp;
    }
    console.log(beacons);
}

function removeOldBeacons() {
    let timeNow = Date.now();
    for (let key in beacons)
    {
        // Only show beacons updated during the last 0,5 seconds.
        let beacon = beacons[key];
        let timeStamp = beacon.getTimeStamp();
        if (timeStamp + 1000 < timeNow)
        {
            delete beacons[key];
        }
    }
}



function calculateDistance(beacon_obj) {
    //Получить данные о метке
    //Используя формулу для дистанции - вычислить ее до этой метки
    //В качестве rssi - берем последнее значение из beacon.getData()
    let beacon = beacon_obj;
    let rssi = beacon.getData()[beacon.getData().length-1],
        txPower = beacon.getTxPower(),
        n = 2,
        rssi_arr = beacon.getData();

    let power = (rssi - txPower)/(-10*n);
    let distance = Math.pow(10,power);
    return distance;
}

function filterBeaconData(beacon){
    //Взять метку
    //Выбрать ее массив с rssi
    //сделать map на жтот массив сприменением фильтра калмана
    //запихнуть этот массив обратно в метку
    let data = beacon.getData();
    let filtered_data = data.map(function (elem) {
        return parseInt(kalmanFilter.filter(elem));
    })
    console.log(filtered_data);
    beacon.appendFilteredData(filtered_data);
}

var beacons = {}

document.querySelector('#add-beacon').addEventListener('click', addBeacon);

document.querySelector('#show').addEventListener('click', function () {
    /*for (key in beacons){
        if (beacons[key].getTimeStamp() + 1000 < Date.now()){
            delete beacons[key];
        }
    }
    console.log(beacons)*/
    /*let uid = document.querySelector('input[name="UID"]').value;
    let beacon = beacons[uid];
    for(key in beacon){
        console.log(key + ' -- ' + beacon[key]);
    }
    let counter = 0;
    for (key in beacons){
        counter++;
    }
    console.log(counter);*/
    let element = document.getElementById('container');
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
    let html = '';
    for (key in beacons){
        let beacon = beacons[key];
        let htmlBeacon = document.createElement('p')
        htmlBeacon.innerHTML = "UID = " + beacon.getUID()
            + "RSSI = " + beacon.getRSSI() + "<br>"
            + "TxPower = " + beacon.getTxPower() + "<br>"
            + "TimeStamp = : " + beacon.getTimeStamp() + "<br>"
            + "Data : " + beacon.getData() + "<br>"
            + "Filtered Data : " + beacon.getFilteredData() + "<br>"
        html=htmlBeacon;
        document.getElementById('container').appendChild(html);
    }
    console.log(beacons);
});


document.querySelector('#calculate').addEventListener('click', function () {
    let uid = document.querySelector('input[name="UID"]').value;
    console.log(calculateDistance(beacons[uid]));
});

document.querySelector('#get-distance-all').addEventListener('click', function () {
    for(key in beacons){
        console.log(calculateDistance(beacons[key]));
    }
})

document.querySelector('#filter').addEventListener('click', function () {
    for (key in beacons) {
        let data = beacons[key].getData()
        console.log(data)
        data = data.slice(data.length-20, data.length)
        console.log(data)
    }
})

document.querySelector('#removeOld').addEventListener('click', function () {
    removeOldBeacons();
})


function sortBeaconsByRSSI() {
    //Проходим по beacons{} и сортируем по большему RSSI
    /*let beacons2 = {
        'asf':{name:"asf", rssi:-55},
        'dsd':{name:"dsd", rssi:-70},
        'fhg':{name:"fhg", rssi:-45},
        'lhi':{name:"lhi", rssi:-90}
    }
    let sortable = []
    for (key in beacons2){
        sortable.push(beacons2[key])
    }
    sortable.sort(function (a,b) {
        return b.rssi - a.rssi;
    })
    beacons2={}
    sortable.map((elem)=>{
        beacons2[elem.name] = elem
    })*/

    //Проходим по beacons{} и сортируем по большему RSSI
    let sortable = []
    for (key in beacons){
        sortable.push(beacons[key])
    }
    sortable.sort(function (a,b) {
        return b.getRSSI() - a.getRSSI();
    })
    beacons={}
    sortable.map((elem)=>{
        beacons[elem.UID] = elem
    })
    let drawable = [];
    let i = 0
    for(key in beacons){
        if (i!==3){
            drawable.push(beacons[key]);
            i+=1;
        }else {
            break
        }
    }
    console.log(drawable[0].getData().slice(-4))
   
}

document.querySelector('#rssiFilter').addEventListener('click', sortBeaconsByRSSI);



