//import {getTrilateration} from './Functions/trilateration';
(function(){
    var Beacon = require('./Beacon');
    //var KF = require('./Kalman');
    var KalmanFilter = require('kalmanjs').default;
    var kalmanFilter = new KalmanFilter({R: 3, Q: 40});
    var getTrilateration = require('./Functions/trilateration');
    var recieved_beacons = {}               //Словарь для принятых меток, даные здесь отличаются от beacons
    var beacons = {}                        //Созданный мною словарь
    var timer = null;
    const drawFunctions = require("./Functions/drawFunctions");
    
    const LENGTH_OF_BEACON_DATA_ARR = 30;

    /*Room
        '5bd576c1a37613dd9916':{
            uid:'5bd576c1a37613dd9916',
            coord_x:5,
            coord_y:5
        },
        'f2ad57ae245813068c18':{
            uid:'f2ad57ae245813068c18',
            coord_x:400,
            coord_y:140
        },
        '0fe399fbedb1dac798c8':{
            uid:'f2ad57ae245813068c18',
            coord_x:130,
            coord_y:380
        },*/

    /*  HomeMap
        cx="656.2" cy="172" r="0.8"
        cx="618.7" cy="573.1" r="0.8"
        cx="471.3" cy="385.5" r="0.8"*/

    const DATABASE_BEACONS = {
        '5bd576c1a37613dd9916':{
            uid:'5bd576c1a37613dd9916',
            coord_x:470.5 ,
            coord_y:289.5,
            floor:1
        },
        'f2ad57ae245813068c20':{
            uid:'f2ad57ae245813068c20',
            coord_x:650.5,
            coord_y:495
        },
        '0fe399fbedb1dac798c8':{
            uid:'0fe399fbedb1dac798c8',
            coord_x:475.5,
            coord_y:497
        },
        'f2ad57ae245813068c18':{
            uid:'f2ad57ae245813068c18',
            coord_x:525.5,
            coord_y:700.5
        }

    }
    
    function onDeviceReady() {
        document.querySelector('#buttons').style.display = 'block';
        alert('I am ready');
    }

    function onStartScanButton() {
        //Интервал сканирования
        setTimeout(startScan,500);
        //Интервал обновления информации
        //Отключили таймер
        //timer = setInterval(updateBeaconList,500);
        timer = setInterval(function () {
            handleBeacons();
            removeOldRecievedBeacons();
            //displayBeacons();
            updateBeaconList();
        },700);
    }

    function onStopScanButton() {
        showMessage('Stopped');
        evothings.eddystone.stopScan();
    }

    //Button - "Покажи, что есть" - вызывает displayBeacons()
    function onShowButton() {
        let element = document.getElementById('found-beacons');
        while(element.firstChild){
            element.removeChild(element.firstChild)
        }
        displayBeacons();
    }

    function onBackButtonDown() {
        evothings.eddystone.stopScan();
        navigator.app.exitApp();
    }

    function successCallback(recieved_beacon) {
        //Получить сигнал метки
        //Поставить ей временной штамп и отправить в словарь найденных меток ---> recieved_beacons{}
        recieved_beacon.timeStamp = Date.now();
        recieved_beacons[recieved_beacon.address] = recieved_beacon;
    }

    function errorCallback(error) {
        alert(error);
    }

    function startScan(){
        //showMessage('Scan in progress');
        evothings.eddystone.startScan(successCallback, errorCallback);
    }

    // Map the RSSI value to a value between 1 and 100.
    /*function mapBeaconRSSI(rssi) {
        if (rssi >= 0) return 1; // Unknown RSSI maps to 1.
        if (rssi < -100) return 100; // Max RSSI
        return 100 + rssi;
    }

    function getSortedBeaconList(beacons) {
        var beaconList = [];
        for (var key in beacons)
        {
            beaconList.push(beacons[key]);
        }
        beaconList.sort(function(beacon1, beacon2)
        {
            return mapBeaconRSSI(beacon1.rssi) < mapBeaconRSSI(beacon2.rssi);
        });
        return beaconList;
    }*/

    function updateBeaconList() {
        removeOldBeacons();
        //removeFarAwayBeacons();
        sortBeaconsByRSSI();
        displayBeacons();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////   Блок удаления данных о метках   //////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////

    function removeOldRecievedBeacons() {
        //Удалить старые метки
        //Если вдруг сигнал потеряется, то метка все равно останется в словаре
        //И будет мешать
        let timeNow = Date.now();
        for (let key in recieved_beacons)
        {
            // Only show beacons updated during the last 0,5 seconds.
            let beacon = recieved_beacons[key];
            if (beacon.timeStamp + 1500 < timeNow)
            {
                delete recieved_beacons[key];
            }
        }
    }                                                       //Удаление данных о метках (Не преобразованных)

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
    }                                                               //Удаление данных о метках

    function removeFarAwayBeacons() {
        for (let key in beacons){
            let rssi = beacons[key].getRSSI(),
                txPower = beacons[key].getTxPower();
            if (txPower - rssi > 20){
                delete beacons[key];
            }
        }
    }                                                           //Удаление данных о метках, которые находятся дальше всех (Не доделано)

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////  Конец блока даления данных о метках   /////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////



    //////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////   Блок обработки данных о метках   /////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////

    function handleBeacons() {
        //Берем метки из recieved_beacons{}
        //Проходим по их свойствам, создаем объект Beacon(uid,bid,rssi,txPower) и кладем в словарь
        //Если такой объект уже есть в словаре, то добавляем rssi к параметру Beacon.data

        let uid = '',
            bid = '',
            rssi = 0,
            txPower = 0,
            html = '';

        for (key in recieved_beacons){
            uid = htmlBeaconNID(recieved_beacons[key]);
            bid = htmlBeaconBID(recieved_beacons[key])
            rssi = htmlBeaconRSSI(recieved_beacons[key]);
            txPower = htmlBeaconTxPower(recieved_beacons[key]);
            let timeStamp = recieved_beacons[key].timeStamp;

            if(beacons[uid] === undefined){
                beacons[uid] = new Beacon(uid,bid,rssi,txPower);
            }else{
                let temp = beacons[uid];
                let data_arr = temp.getData()
                temp.setRSSI(rssi)
                if((data_arr.length === LENGTH_OF_BEACON_DATA_ARR)|| (data_arr.length> LENGTH_OF_BEACON_DATA_ARR)){ //Если длина массива больше константы
                                                                                                                    //То отрезаем последние 20 элементов
                    temp.setData(data_arr.slice((-20)))                                                              //И ставим их на начало
                }else {
                    temp.appendData(rssi)                                                                           //Иначе просто добавляем RSSI в массив
                }
                temp.setTimeStamp(timeStamp);
                beacons[uid] = temp;
            }
            filterBeaconData(beacons[uid]);
        }
        //sortBeaconsByRSSI();
    }

    function filterBeaconData(beacon){
        //Взять метку
        //Выбрать ее массив с rssi
        //сделать map на этот массив сприменением фильтра калмана
        //запихнуть этот массив обратно в метку
        let data = beacon.getData();
        data = data.slice(data.length-20, data.length);
        let filtered_data = data.map(function (elem) {
            return parseInt(kalmanFilter.filter(elem));
        })
        beacon.appendFilteredData(filtered_data);
    }

    function calculateDistanceFromBeacon(beacon) {
        //Взять метку
        //Высчитать расстояние от нее по отфильтрованному значнию rssi
        let ble_beacon = beacon;
        let rssi = ble_beacon.getFilteredData()[ble_beacon.getFilteredData().length-1],
            txPower = ble_beacon.getTxPower(),
            n = 2;
        let power = (txPower - rssi)/(10*n);
        let distance = Math.pow(10,power);
        return distance;
    }

    function sortBeaconsByRSSI() {
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
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////   Конец блока обработки данных о метках   //////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////



    //////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////   Блок отображения данных о метках   ///////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////

    function displayBeacons() {
        let element = document.getElementById('found-beacons');
        while(element.firstChild){
            element.removeChild(element.firstChild)
        }
        let html = '';
        if (Object.keys(beacons).length == 0){
            showMessage('No beacons found');
        }else{
            for (key in beacons){
                let beacon = beacons[key];
                let htmlBeacon = document.createElement('p')
                //let uid = '5bd576c1a37613dd9916';

                htmlBeacon.innerHTML = "UID = " + beacon.getUID()+'<br>'
                    + "RSSI = " + beacon.getRSSI() + "<br>"
                    + "Floor = " + DATABASE_BEACONS[beacon.getUID()].floor + "<br>"
                    + "TxPower = " + beacon.getTxPower() + "<br>"
                    + "TimeStamp = : " + beacon.getTimeStamp() + "<br>"
                    + "Data : " + beacon.getData() + "<br>"
                    + "Filtered Data : " + beacon.getFilteredData() + "<br>"
                    + "Distance : " + calculateDistanceFromBeacon(beacon) + "<br>"
                html=htmlBeacon;
                document.getElementById('found-beacons').appendChild(html);
            }
            drawUserOnMap();
        }
    }

    function drawUserOnMap() {
        //На данном этапе beacons{} уже отсортирован по мощности RSSI
        //let coords = [{x:5,y:5,distance:265},{x:445,y:140,distance:280},{x:150,y:275,distance:distance}]]
        //drawable = [{UID: "5f-a2-b6-a6-f5", RSSI: -45, TxPower: -60, data: Array(1), filtered_data: Array(0), …}]
        //Получить данные о дистанции
        //Если меньше 3, то пишем - мало данных
        //Иначе рисуем
        let drawable = [];
        let i = 0
        for(key in beacons){
            if (i!==3){
                drawable.push(beacons[key]);
                i+=1;
            }else {
                break
            }
        };
        /*let pos1 = {x:5,y:5,distance:265},
            pos2 = {x:445,y:140,distance:280},
            pos3 = {x:150,y:275,distance:120};*/
        if(drawable.length<3){
            showMessage('Not Enough Data to Draw You');
        }else {
            showMessage('');
            let element = document.querySelector('#distances');
            while(element.firstChild){
                element.removeChild(element.firstChild)
            }
            for(let i = 0; i<drawable.length; i++){
                let beacon = drawable[i];
                beacon.setDistance(calculateDistanceFromBeacon(beacon));
                let distance = (beacon.getDistance()*80)|0;
                let htmlDistance = document.createElement('p');
                htmlDistance.innerHTML = 'Distance from '+beacon.getUID() + ' = ' + distance + ' ['
                    + DATABASE_BEACONS[beacon.getUID()].coord_x +','+
                    + DATABASE_BEACONS[beacon.getUID()].coord_y + ']';
                element.appendChild(htmlDistance);
            }
            let pos1 = {x:DATABASE_BEACONS[drawable[0].getUID()].coord_x, y:DATABASE_BEACONS[drawable[0].getUID()].coord_y , distance:(drawable[0].getDistance()*70)|0},
                pos2 = {x:DATABASE_BEACONS[drawable[1].getUID()].coord_x, y:DATABASE_BEACONS[drawable[1].getUID()].coord_y , distance:(drawable[1].getDistance()*70)|0},
                pos3 = {x:DATABASE_BEACONS[drawable[2].getUID()].coord_x, y:DATABASE_BEACONS[drawable[2].getUID()].coord_y , distance:(drawable[2].getDistance()*70)|0};
            let {x,y} = getTrilateration(pos1,pos2,pos3);
            drawFunctions.drawUser(x,y);
        }

        /*for(key in beacons){
            let beacon = beacons[key];
            let distance = calculateDistanceFromBeacon(beacon);
            pos3.distance = (distance*100)|0;
            let htmlDistance = document.createElement('p');
            htmlDistance.innerHTML = 'Distance from '+beacon.getUID() +' : '+distance + '  pos3.distance = ' + pos3.distance;
            element.appendChild(htmlDistance);
        }*/
        /*let time = Date.now();
        let cordsEl = document.querySelector('#coords');
        while(cordsEl.firstChild){
            cordsEl.removeChild(cordsEl.firstChild)
        }
        let {x,y} = getTrilateration(pos1,pos2,pos3);
        let htmlCoords = document.createElement('p');
        htmlCoords.innerHTML =`coords: ${x} and ${y}. Time: ${time} and pos3: ${pos3.distance}`; //'coords: ' + x + '   ' + y + '  data   ' + time;

        cordsEl.appendChild(htmlCoords);
        drawFunctions.drawUser(x,y)*/

    }

    function showMessage(text) {
        document.querySelector('#message').innerHTML = text;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////   Конец блока отображения данных о метках   ////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////



    //////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Блок функций преобразователей///////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////

    function htmlBeaconNID(beacon) {
        return beacon.nid ?
            uint8ArrayToString(beacon.nid) :  '';
    }

    function htmlBeaconBID(beacon) {
        return beacon.bid ?
            'BID: ' + uint8ArrayToString(beacon.bid) + '<br/>' :  '';
    }

    function htmlBeaconRSSI(beacon) {
        return beacon.rssi;
    }

    function htmlBeaconTxPower(beacon) {
        return beacon.txPower?
            beacon.txPower: '';
    }

    function uint8ArrayToString(uint8Array) {
        function format(x)
        {
            var hex = x.toString(16);
            return hex.length < 2 ? '0' + hex : hex;
        }
        var result = '';
        for (var i = 0; i < uint8Array.length; ++i)
        {
            //result += format(uint8Array[i]) + ' ';
            result += format(uint8Array[i]);
        }
        return result;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////Конец Блока функций - преобразователей///////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////



    function onShowBeaconsButton(){
        alert(beacons);
    }

    // This calls onDeviceReady when Cordova has loaded everything.
    document.addEventListener('deviceready', onDeviceReady, false);
    document.querySelector('#start-scan').addEventListener('click', onStartScanButton);
    document.querySelector('#stop-scan').addEventListener('click', onStopScanButton);
    //document.querySelector('#show-btn').addEventListener('click', onShowButton);
    //document.querySelector('#show-beacons').addEventListener('click', onShowBeaconsButton);
    //document.querySelector('#rssiFilter').addEventListener('click', sortBeaconsByRSSI);
    document.querySelector("#drawUser").addEventListener('click', function () {
        let pos1 = {x:656.2,y:172,distance:265},
            pos2 = {x:618.7,y:573.1,distance:280},
            pos3 = {x:471.3,y:385.5,distance:120};
        let {x,y} = getTrilateration(pos1,pos2,pos3);
        drawFunctions.drawUser(x,y);        //DrawUser(x,y,FloorMap)
    })


})(); // End of closure.