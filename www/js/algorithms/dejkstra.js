//var roomNodes = ['entrance','server','e8','wardrobe','kitchen','e14','e16','e20','e24','e36','e40'];

//'entrance-way','server-way','e8-way','wardrobe-wa','kitchen-way','e14-way','e16-way','e20-way','e24-way','e36-way','e40-way'
/*var roomAdjacencyMatrix = [ [1,	0,	0,	0,	0,	0,	0,	0,	0,	0,	0],
    [0,	1,	0,	0,	0,	0,	0,	0,	0,	0,	0],
    [0,	0,	1,	0,	0,	0,	0,	0,	0,	0,	0],
    [0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	0],
    [0,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0],
    [0,	0,	0,	0,	0,	1,	0,	0,	0,	0,	0],
    [0,	0,	0,	0,	0,	0,	1,	0,	0,	0,	0],
    [0,	0,	0,	0,	0,	0,	0,	1,	0,	0,	0],
    [0,	0,	0,	0,	0,	0,	0,	0,	1,	0,	0],
    [0,	0,	0,	0,	0,	0,	0,	0,	0,	1,	0],
    [0,	0,	0,	0,	0,	0,	0,	0,	0,	0,	1] ];*/

//var wayNodes = ['entrance-way','server-way','e8-way','wardrobe-way','kitchen-way','e14-way','e16-way','e20-way','e24-way','e36-way','e40-way'];
//var wayNodes = ['a','b','c','d','e','f','g','h','k','l'];

//var wayNodes = ['a','b','c','d','e','f','g','h','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','a1','a2','a3'];
//console.log(wayNodes.length)

/*var wayAdjacencyMatrix = [[0, 6, 10, 0, 0, 0, 0, 0, 0, 0],
                            [6, 0, 12, 11, 14, 0, 0, 0, 0, 0],
                            [10, 12, 0, 12, 0, 0, 8, 16, 0, 0],
                            [0, 11, 12, 0, 0, 6, 3, 0, 0, 0],
                            [0, 14, 0, 0, 0, 4, 0, 0, 6, 0],
                            [0, 0, 0, 6, 4, 0, 0, 0, 12, 0],
                            [0, 0, 8, 3, 0, 0, 0, 0, 16, 6],
                            [0, 0, 16, 0, 0, 0, 0, 0, 0, 8],
                            [0, 0, 0, 0, 6, 12, 16, 0, 0, 13],
                            [0, 0, 0, 0, 0, 0, 6, 8, 13, 0, ]];*/
/*var wayAdjacencyMatrix = [
    [0, 6, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, 0, 12, 11, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10, 12, 0, 12, 0, 0, 8, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 11, 12, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 14, 0, 0, 0, 4, 0, 0, 6, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 4, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 8, 3, 0, 0, 0, 0, 16, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 16, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 12, 16, 0, 0, 13, 0, 8, 3, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 6, 8, 13, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 8, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 5, 0, 0, 0, 3, 6, 3, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 0, 7, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 6, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 7, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 1, 0, 0, 11, 0, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 11, 0, 3, 0, 7, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 11, 0, 0, 5, 8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 11, 0, 7, 3, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 7, 0, 0, 0, 7, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 11],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 7, 0, 2, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 3, 0]];*/



//var visited = [] Перенес в Дейкстру, т.е если запускать поиск еще раз, то он намертво виснет

//Test 15.02.2019
//http://graphonline.ru/?graph=YHtNdylaSOyGSwDF
var wayNodes = ['Entrance-way','Livingroom-way','Firstbedroom-way','Wardrobe-way','Kitchen-way','WC-way','Bathroom-way','Secondbedroom-way','Cross-1','Cross-2','Cross-3']

var wayAdjacencyMatrix = [  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                            [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                            [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0],
                            [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
                            [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0] ]


/*console.log('Кратчайший путь от: '+ startNode + ' к: ' + endNode + ' проходит через: '
            + Dejkstra(startNode,endNode)[0] + ' длина пути = '+ Dejkstra(startNode,endNode)[1]);*/

//marks = [number,number,...] Элементы идут в том порядке, в котором идут в массиве вершин

function findPath(startNode, endNode) {
    var marks = [];
    for(let i = 0; i<wayNodes.length;i++){
        marks.push(1000);
    }
    //var marks = [1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1000];
    marks[wayNodes.indexOf(startNode)] = 0;
    function NextNode(node,visited) {

        var indexOfShortestWay = 0; //Точка у которой самый кратчайший путь от ткущей вершины, то бишь следующая вершина в которую пойдем
        var currentNode = node;
        var currentIndex = wayNodes.indexOf(node);
        var i = 0;
        while (i < wayAdjacencyMatrix[currentIndex].length){
            if(wayAdjacencyMatrix[currentIndex][i]){
                let tempLength = marks[currentIndex] + wayAdjacencyMatrix[currentIndex][i];
                if(marks[i] === 1000){
                    marks[i] = 0 + tempLength;
                }else if(marks[i] > tempLength){
                    marks[i] = tempLength;
                }
            }
            i++;
        }
        var j = 0;
        visited.push(currentNode);
        var shortestWay = 999;
        while(j<marks.length){
            if((marks[j] !== 1000) && marks[j] && (visited.includes(wayNodes[j]) === false)){
                if (shortestWay > marks[j]){
                    shortestWay = marks[j];
                    indexOfShortestWay = j;
                }
            }
            j++;
        }
        return wayNodes[indexOfShortestWay];
    }
    function Dejkstra(startNode, endNode) {
        var visited = [];
        var i = 0;
        var currentNode = startNode;
        while(i < wayNodes.length){
            currentNode = NextNode(currentNode,visited);
            i++;
        }
        var totalDistance = marks[wayNodes.indexOf(endNode)];
        var path = [];
        var previousNode = '';
        let flag = path.includes(startNode);
        while (!flag){
            let i = 0;
            while (i < wayAdjacencyMatrix[wayNodes.indexOf(endNode)].length){
                if (wayAdjacencyMatrix[wayNodes.indexOf(endNode)][i]){
                    var difference = marks[wayNodes.indexOf(endNode)] - wayAdjacencyMatrix[wayNodes.indexOf(endNode)][i];
                    if (difference === marks[i]){
                        previousNode = wayNodes[i];
                    }
                }
                i+=1;
            }
            path.push(endNode);
            endNode = previousNode;
            if(endNode === startNode){ flag = true;}
        }
        path.push(startNode);
        path.reverse();
        //console.log(marks)
        return [path, totalDistance];
    }
    return Dejkstra(startNode,endNode);
    //return [path, totalDistance];
}
/*startNode = 'WC-way';
endNode = 'Firstbedroom-way';
//let now = Date.now();
console.log('Кратчайший путь от: '+ startNode + ' к: ' + endNode + ' проходит через: '
    + findPath(startNode,endNode)[0] + ' длина пути = '+ findPath(startNode,endNode)[1]);*/



module.exports = findPath;