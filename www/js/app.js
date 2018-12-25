
(function(){
    var Beacon = require('./Beacon');
    //var KF = require('./Kalman');
    var KalmanFilter = require('kalmanjs').default;
    var kalmanFilter = new KalmanFilter({R: 3, Q: 30});
    var recieved_beacons = {}               //Словарь для принятых меток, даные здесь отличаются от beacons
    var beacons = {}                        //Созданный мною словарь
    var timer = null;

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
            displayBeacons();
        },500);
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
        displayBeacons();
    }

    function removeOldRecievedBeacons() {
        //Удалить старые метки
        //Если вдруг сигнал потеряется, то метка все равно останется в словаре
        //И будет мешать
        let timeNow = Date.now();
        for (let key in recieved_beacons)
        {
            // Only show beacons updated during the last 0,5 seconds.
            let beacon = recieved_beacons[key];
            if (beacon.timeStamp + 500 < timeNow)
            {
                delete recieved_beacons[key];
            }
        }
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
                temp.appendData(rssi)
                beacons[uid] = temp;
            }
            filterBeaconData(beacons[uid]);
        }
    }

    function filterBeaconData(beacon){
        //Взять метку
        //Выбрать ее массив с rssi
        //сделать map на жтот массив сприменением фильтра калмана
        //запихнуть этот массив обратно в метку
        let data = beacon.getData();
        data = data.slice(data.length-15, data.length);
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

    function displayBeacons() {
        let element = document.getElementById('found-beacons');
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
                + "Distance : " + calculateDistanceFromBeacon(beacon) + "<br>"
            html=htmlBeacon;
            document.getElementById('found-beacons').appendChild(html);
        }
    }

    ///////////////////////////////// Блок функций преобразователей///////////////////////////////////
    function htmlBeaconNID(beacon) {
        return beacon.nid ?
            'NID: ' + uint8ArrayToString(beacon.nid) + '<br/>' :  '';
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
    /////////////////////////////////Конец Блока функций - преобразователей////////////////////////////

    function uint8ArrayToString(uint8Array) {
        function format(x)
        {
            var hex = x.toString(16);
            return hex.length < 2 ? '0' + hex : hex;
        }
        var result = '';
        for (var i = 0; i < uint8Array.length; ++i)
        {
            result += format(uint8Array[i]) + ' ';
        }
        return result;
    }

    function showMessage(text) {
        document.querySelector('#message').innerHTML = text;
    }

    function onShowBeaconsButton(){
        alert('Сейчас покажу');
        let arr = '';
        for (key in beacons){
            let elem = document.createElement('p');
            elem.innerHTML = "UID: " + key;
        arr+=elem;
        }
        document.getElementById("beacons-arr").innerHTML = arr;
    }

    // This calls onDeviceReady when Cordova has loaded everything.
    document.addEventListener('deviceready', onDeviceReady, false);
    document.querySelector('#start-scan').addEventListener('click', onStartScanButton);
    document.querySelector('#stop-scan').addEventListener('click', onStopScanButton);
    document.querySelector('#show-btn').addEventListener('click', onShowButton);
    document.querySelector('#show-beacons').addEventListener('click', onShowBeaconsButton);




})(); // End of closure.