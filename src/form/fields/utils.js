
const convexShape = (dots)=>{
    let result = [];
    for(let i=0; i< dots.length; i=i+2){
        if(!dots[i+4] && !dots[i+2]){
            let pointAB =
                {
                    x: (dots[i] - dots[0]),
                    y: (dots[i + 1] - dots[1]),
                };
            let pointBC =
                {
                    x: (dots[0] - dots[2]),
                    y: (dots[1] - dots[3]),
                };
            let product = pointAB.x * pointBC.y - pointAB.y * pointBC.x;
            result.push(product)
        } else if(!dots[i+4]){
            let pointAB =
                {
                    x: (dots[i] - dots[i + 2]),
                    y: (dots[i + 1] - dots[i + 3]),
                };
            let pointBC =
                {
                    x: (dots[i + 2] - dots[0]),
                    y: (dots[i + 3] - dots[1]),
                };
            let product = pointAB.x * pointBC.y - pointAB.y * pointBC.x;
            result.push(product)
        } else {
            let pointAB =
                {
                    x: (dots[i] - dots[i + 2]),
                    y: (dots[i + 1] - dots[i + 3]),
                };
            let pointBC =
                {
                    x: (dots[i + 2] - dots[i + 4]),
                    y: (dots[i + 3] - dots[i + 5]),
                };
            let product = pointAB.x * pointBC.y - pointAB.y * pointBC.x;
            result.push(product)
        }
    }
    const plus = (element) => element >= 0;
    const minus = (element) => element <= 0;
    return (result.some(plus) !== result.some(minus))
}
const hexToRgb = (c) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
const inPoly = (x,y,array)=> {
    let dx = [];
    let dy = [];
    for( let i = 0; i<array.length; i= i+2) {
        dx.push(array[i]);
        dy.push(array[i + 1]);
    }
    let npol = dx.length;
    let j = npol - 1;
    let c = 0;
    for (let i = 0; i < npol;i++){
        if ((((dy[i]<=y) && (y<dy[j])) || ((dy[j]<=y) && (y<dy[i]))) &&
            (x > (dx[j] - dx[i]) * (y - dy[i]) / (dy[j] - dy[i]) + dx[i])) {
            c = !c
        }
        j = i;
    }
    return c;
}
const lineIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    var a_dx = x2 - x1;
    var a_dy = y2 - y1;
    var b_dx = x4 - x3;
    var b_dy = y4 - y3;
    var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
    var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
    let array =  [x1, y1, x2, y2, x3, y3, x4, y4];
    if(s >= 0 && s <= 1 && t >= 0 && t <= 1){
        return {result: !(array.includes(x1 + t * a_dx) && array.includes( y1 + t * a_dy)), arr: array} ;
    }
    return {result: false, arr: array};
};

export {convexShape,hexToRgb,inPoly,lineIntersect}
