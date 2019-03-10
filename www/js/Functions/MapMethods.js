const MAP_ELEMENTS = ['path', 'rect', 'polyline','line'];
function getSVGMap() {
    /*let object = document.getElementById('object');
    let Document = object.contentDocument*/
    //let svg = Document.childNodes[1];
    let svg = document.querySelector("svg");
    return svg;
}

function changeClass(elem,className){                                           //Присвоение класса элементу
    elem.className.baseVal = className;
}

function addClass(elem,className){                                              //Добавление класса к элементу
    elem.className.baseVal += ` ${className}`;
}

function getMapElementById(elementName){                                        //Достаем элемент из карты по ID
    let map = getSVGMap();
    let element = map.querySelector(`#${elementName}`)
    return element;
}

function changeFloor(floorNumber) {
    let map = getSVGMap()
    let children = map.childNodes
    for(child in children){
        if(children[child].tagName === 'g'){
            let element = children[child];
            //Если id элемента не включает номер текущего этажа, то скрываем его, если это не элементы контроля карты
            if((element.id.indexOf(floorNumber) === -1) && (element.id !=='svg-pan-zoom-controls')) element.setAttribute('class','hidden');
            //Если id элемента включает в сябя номер текущего этажа, но у него скрытый класс
            if(element.id.indexOf(floorNumber) !== -1 /*&& element.getAttribute("class") === 'hidden'*/) {
                element.setAttribute('class','svg-pan-zoom_viewport');
            }
            /*if(element.id.indexOf(floorNumber) !== -1 && element.getAttribute("class") === ''){
                element.setAttribute('class','svg-pan-zoom_viewport');
            }*/
        }
    }
    //var svgElement = document.querySelector('svg');
    //svgPanZoom.destroy();
    /*svgPanZoom(map,{
        zoomEnabled: true,
        controlIconsEnabled: true,
        fit:true,
        center:true,
        viewportSelector:`.svg-pan-zoom_viewport`
        //viewportSelector:`#Floor_${floorNumber}`
    })*/
}

function clearMap(map, prevStartNode, prevEndNode, prevPath){
    if(getMapElementById(prevStartNode).tagName === 'g'){                           //Если элемент - составная фигура в теге g, меняем класс у ее потомков
        let children = getMapElementById(prevStartNode).childNodes;
        for (child in children){
            if(MAP_ELEMENTS.indexOf(children[child].tagName) !== -1 /*'polyline'*/){
                changeClass(children[child], 'room')                                //Не использую getById т.к итак находит элмент напрмую
            }
        }
    }else{
        changeClass(getMapElementById(prevStartNode), 'room');
    }
    if(getMapElementById(prevEndNode).tagName === 'g'){                             //Если элемент - составная фигура в теге g, меняем класс у ее потомков
        let children = getMapElementById(prevEndNode).childNodes;
        for (child in children){
            if(MAP_ELEMENTS.indexOf(children[child].tagName) !== -1 /*'polyline'*/){
                changeClass(children[child], 'room')                             //Не использую getById т.к итак находит элмент напрмую
            }
        }
    }else{
        changeClass(getMapElementById(prevEndNode), 'room');
    }
    for (elem in prevPath){                                                         //Меняем класс у вершин пути
        changeClass(getMapElementById(prevPath[elem]),'road');
    }
}

function drawPath(startNode, endNode, path){
    if(getMapElementById(startNode).tagName === 'g'){                           //Если элемент - составная фигура в теге g, меняем класс у ее потомков
        let children = getMapElementById(startNode).childNodes;
        for (child in children){
            if(MAP_ELEMENTS.indexOf(children[child].tagName) !== -1 /*'polyline'*/){
                addClass(children[child], 'start-node')                         //Не использую getById т.к итак находит элмент напрмую
            }
        }
    }else{
        addClass(getMapElementById(startNode), 'start-node');
    }
    if(getMapElementById(endNode).tagName === 'g'){                             //Если элемент - составная фигура в теге g, меняем класс у ее потомков
        let children = getMapElementById(endNode).childNodes;
        for (child in children){
            if(MAP_ELEMENTS.indexOf(children[child].tagName) !== -1 /*'polyline'*/){
                addClass(children[child], 'end-node')                           //Не использую getById т.к итак находит элмент напрмую
            }
        }
    }else{
        addClass(getMapElementById(endNode), 'end-node');
    }
    for (elem in path){                                                         //Меняем класс у вершин пути
        changeClass(getMapElementById(path[elem]),'active-road');

    }
}

module.exports = {
    getSVGMap:getSVGMap,
    changeClass:changeClass,
    addClass:addClass,
    getMapElementById:getMapElementById,
    clearMap:clearMap,
    drawPath:drawPath,
    changeFloor:changeFloor
}


