const drawFunctions = require('./Functions/drawFunctions');
const dejkstra = require('./algorithms/dejkstra');
const {getSVGMap, changeClass, addClass, getMapElementById, clearMap, drawPath, changeFloor} = require('./Functions/MapMethods');
//const svgPanZoom = require('../../node_modules/svg-pan-zoom/dist/svg-pan-zoom');
const svgPanZoom = require('svg-pan-zoom');
//5bd576c1a37613dd9916



var prevStartNode = '',
    prevEndNode = '',
    prevPath = [],
    //children = getSVGMap().childNodes,
    nodes = [],
    START_END_NODES = [],                                                       //Массив для вершин, которые польщователь выбирает по карте
    CHOSE_ON_MAP_MODE = false,
    MAP_ELEMENTS = ['path', 'rect', 'polyline','line'],
    CURRENT_LOCATION = 'home',
    CURRENT_FLOOR = 1,                                                          //По умолчанию 1-й эатж - начальный
    TEST_VAR_MAP = '';                                                          //В этой переменной хранится код карты зданий, необходимо для корректной работы смены карты

function addSvgPanZoom(SVGMap) {
    //Добавляет SvgPanZoom к карте здания для манипуляции
    let panzoom = svgPanZoom(SVGMap,{
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit:true,
        center:true,
        viewportSelector:`.svg-pan-zoom_viewport`
    })
    console.log(panzoom.zoom(2))
}

function downloadMap(name){
    fetch("https://roomlocator.herokuapp.com/map/mirea", {
        method: 'GET'
    })
        .then(response => {
            return response.text();
        })
        .then(svg => {
            document.getElementById('map').insertAdjacentHTML("afterbegin", svg);
            TEST_VAR_MAP = svg;
            window.TEST_VAR_MAP = TEST_VAR_MAP;
        })
        .then(() => {
             /*for (let i = 0; i<children.length; i++){
                let id = children[i].id;
                if(id && id.indexOf('-way') === -1 && id.indexOf('p-') === -1){
                    nodes.push(id);
                }
            }*/
            //let CURRENT_FLOOR = 1;
            changeFloor(CURRENT_FLOOR)
            console.log('floor changed for the first time')
            var event = new Event('customEvent');
            document.dispatchEvent(event)
        })

}


document.addEventListener('customEvent', function () {
    console.log('custom event happend')
    document.querySelector('#path-container').setAttribute('class','')

    var map = document.querySelector('svg');
    addSvgPanZoom(map)
})

document.addEventListener('changeFloorEvent', function () {
    //При наступлении события "Смена этажа"
    //Удаляем текущую карту и svgPanZoom вместе с ней
    //Из TEST_VAR_MAP берем карту и добавляем ее в контейнер, делая viewport на нужный этаж
    //Иначе не работает с возможностью манипулирования картой

    //console.log('From changeFloor event',window.floor);
    CURRENT_FLOOR = window.floor;
    var container = document.querySelector('#map');
    while(container.firstChild){
        container.removeChild(container.firstChild)
    }
    document.getElementById('map').insertAdjacentHTML("afterbegin", window.TEST_VAR_MAP);
    changeFloor(CURRENT_FLOOR);
    let map = document.querySelector('svg');
    addSvgPanZoom(map)
})

document.addEventListener('DOMContentLoaded', function () {                                     //При готовности документа....
    //console.log('loaded');
    downloadMap('home');                                                                        //Загружаем карту помещения

    document.querySelector('#findPath').addEventListener('click', function () {
        let startNode = document.querySelector('#startNode').value,
            endNode = document.querySelector('#endNode').value,
            path = dejkstra(startNode + '-way', endNode + '-way')[0],                       //Array of nodes [Node,node,...]
            map = getSVGMap();                                                              //SVG MAP as DOM Element
        console.log(map)
        console.log(`startNode - ${startNode}, endNode - ${endNode}, prevParams: ${prevStartNode}, ${prevEndNode}, ${prevPath}`);
        if (prevEndNode === '' || prevStartNode === '' || (prevEndNode === '' & prevStartNode === '')) {

        } else {
            clearMap(map, prevStartNode, prevEndNode, prevPath);
            prevStartNode = startNode;
            prevEndNode = endNode;
            prevPath = path
        }
        drawPath(startNode, endNode, path)
        prevStartNode = startNode;
        prevEndNode = endNode;
        prevPath = path;
        console.log(`prevParams: ${prevStartNode}, ${prevEndNode}, ${prevPath}`);
        console.log('path', path);
        document.querySelector('#startNode').value = '';
        document.querySelector('#endNode').value = '';
    })
    document.querySelector('#changeFloor').addEventListener('click', function () {
        let event = new Event('changeFloorEvent');
        document.dispatchEvent(event);
    });
});


//Сделать очистку перед следующим поиском пути
//Сделать выбор комнат, чтобы не руками вбивать
//Сделать проверку на правильность введенных начальной/конечной точки
