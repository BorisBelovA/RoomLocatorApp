const getTrilateration = require('./trilateration');
const d3 = require('d3');
const {getSVGMap} = require('./MapMethods');

function createCircle(x,y,r) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
    circle.setAttribute('id','user');
    circle.setAttribute('class','user');
    circle.setAttribute('cx',x);
    circle.setAttribute('cy',y);
    circle.setAttribute('r',r);
    return circle;
}


function drawUser(x,y){
 /*   let {x,y} = getTrilateration({x:445,y:140, distance: 280}, {x:150, y:275, distance: 100}, {x:5, y:5, distance: 265});
    console.log(x,y)
    */
    /*let pos1 = {x:5,y:5,distance:265},
        pos2 = {x:445,y:140,distance:280},
        pos3 = {x:150,y:275,distance:200};
    let {x,y} = getTrilateration(pos1,pos2,pos3);
    console.log(x,y)*/
    //console.log('Mi tut')
    let svg = getSVGMap();// getSVGMap();
    if(svg.querySelector("#user") === null || svg.querySelector("#user") === undefined){
        let circle = createCircle(x,y,5)
        svg.appendChild(circle);
    }else{
        svg.querySelector("#user").remove();
        let circle = createCircle(x,y,5);
        svg.appendChild(circle);
    }

}

function drawPipka() {
    console.log("Pipka is drawn!");
}

module.exports = {
    drawUser:drawUser,
    createCircle:createCircle,
    drawPipka:drawPipka
}

//getSVGMap:getSVGMap