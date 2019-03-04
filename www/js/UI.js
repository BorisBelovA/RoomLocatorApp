const drawFunctions = require('./Functions/drawFunctions');
const dejkstra = require('./algorithms/dejkstra');
const {getSVGMap, changeClass, addClass, getMapElementById, clearMap, drawPath} = require('./Functions/MapMethods');

//5bd576c1a37613dd9916

var prevStartNode = '',
    prevEndNode = '',
    prevPath = [],
    //children = getSVGMap().childNodes,
    nodes = [],
    START_END_NODES = [],                                                         //Массив для вершин, которые польщователь выбирает по карте
    CHOSE_ON_MAP_MODE = false,
    MAP_ELEMENTS = ['path', 'rect', 'polyline','line'],
    CURRENT_LOCATION = 'home',
    CURRENT_FLOOR = 1;

function downloadMap(name){
    fetch("https://roomlocator.herokuapp.com/map/mirea", {
        method: 'GET'
    })
        .then(response => {
            return response.text();
        })
        .then(svg => {
            document.getElementById('map').insertAdjacentHTML("afterbegin", svg);
        })
        .then(() => {
            /*for (let i = 0; i<children.length; i++){
                let id = children[i].id;
                if(id && id.indexOf('-way') === -1 && id.indexOf('p-') === -1){
                    nodes.push(id);
                }
            }*/
            let CURRENT_FLOOR = 1;
            let map = document.querySelector('svg');
            let children = map.childNodes
            for(child in children){
                if(children[child].tagName === 'g'){
                    if(children[child].id.indexOf(CURRENT_FLOOR) === -1) children[child].setAttribute('class','hidden');
                }
            }
            var event = new Event('CustomEvent');
            document.dispatchEvent(event)
        })

}


document.addEventListener('CustomEvent', function () {
    console.log('custom event happend')
})
document.addEventListener('DOMContentLoaded', function () {
    console.log('loaded');
    downloadMap('home');

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
});


//Сделать очистку перед следующим поиском пути
//Сделать выбор комнат, чтобы не руками вбивать
//Сделать проверку на правильность введенных начальной/конечной точки
