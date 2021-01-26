import React, {Component, useEffect, useState,useRef} from 'react';
import {Field, useFormikContext} from "formik";
//import imgReq from './canvas/testImage.jpg'

function ArrowAreasCanvasField(props) {

    let imgReq = 'https://mtdi.mosreg.ru/upload/files/g/i/gio9SFV0y7O9ZsNltS5E62m8vYlN7Y2OBMUSoP6F7lej2dgikbj1X14lv0yV8ymCPdCV6egCP1UzkAjCtWHkzrZQyrDybUU6.jpg'
    const { values, submitForm } = useFormikContext();


    let ctxCanvas = null;
    let imageTest = new Image();
    let canvasWidth = 0;
    let canvasHeight = 0;
    let originWidth = 0;
    let originHeight = 0;
    let mouse = [];
    let colorCanvas = [];

    let move = false;
    let indexMove = null;
    let moveArrow = false;
    let indexMoveArrow = null;
    let scaleImage = null;

    const canvas = useRef(null);

    const [data, setData] = useState({
        arr: values.areas_with_directions && values.areas_with_directions.length > 0 ? values.areas_with_directions : []
    });


    const [activeIndex, setIndex] = useState('');

    const [stateButton,setValueButton] = useState({
        areaSpeed: false,
        area: false,
        edit: false,
        eraser: false,
        arrow: false
    });

    useEffect(()=>{


        ctxCanvas  = canvas.current.getContext('2d');

        canvasWidth = 600;

        imageTest.src = imgReq;
        imageTest.onload = () => {
            originWidth = imageTest.width;
            originHeight = imageTest.height;
            canvasHeight = originHeight * ( canvasWidth/originWidth );

            canvas.current.height = canvasHeight;
            canvas.current.width = canvasWidth;
            scaleImage =  canvasWidth/originWidth;


            canvasRender();
        }

    },[data]);

    for (let i = 0; i < 30; i++){
        let color = Math.floor((Math.random()*10000000)+1);
        if(colorCanvas.indexOf(color) <= 0) colorCanvas.push(("000000" + color.toString(16)).slice(-6));
    }

    const canvasRender = () => {


        window.requestAnimationFrame(canvasRender);
        ctxCanvas.clearRect(0, 0, canvasWidth, canvasHeight);
        ctxCanvas.drawImage(imageTest, 0, 0, canvasWidth, canvasHeight);

        data.arr.forEach(el=>{
            ctxCanvas.beginPath();
            for(let i = 0; i< el.dots.length; i = i + 2){
                ctxCanvas.beginPath();
                ctxCanvas.fillStyle = "#" + el.color;
                ctxCanvas.arc(el.dots[i], el.dots[i+1], 5, 0, 2*Math.PI);
                ctxCanvas.fill();
            }
            ctxCanvas.closePath();

            if(el.type === 'speed_arrow_area' || el.type ===  'arrow_area' ) {

                ctxCanvas.beginPath();
                ctxCanvas.moveTo(el.dots[0],el.dots[1]);
                for(let i = 0; i< el.dots.length; i = i + 2){
                    ctxCanvas.lineTo(el.dots[i],el.dots[i+1])
                }
                ctxCanvas.lineTo(el.dots[0],el.dots[1]);
                let rgb = hexToRgb( "#" + el.color);
                let color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', .5)';
                ctxCanvas.fillStyle = color ;
                ctxCanvas.strokeStyle = "#" + el.color ;
                ctxCanvas.lineWidth =  3;
                ctxCanvas.fill();
                ctxCanvas.stroke();
                ctxCanvas.closePath();

                ctxCanvas.beginPath();
                ctxCanvas.fillStyle = el.color ;
                for(let i = 0; i< el.arrow.length; i = i + 2){
                    ctxCanvas.arc(el.arrow[i], el.arrow[i+1], 4, 0, 2*Math.PI);
                }
                ctxCanvas.fill();
                ctxCanvas.closePath();
                if(el.arrow.length === 4) canvasArrow(el.arrow[0],el.arrow[1],el.arrow[2],el.arrow[3])

            }

        });
    };
    const canvasArrow = (fromx, fromy, tox, toy) =>{
        let arrowLen = 25;	// length of head in pixels
        let dx = tox-fromx;
        let dy = toy-fromy;
        let angle = Math.atan2(dy,dx);
        ctxCanvas.beginPath();
        ctxCanvas.lineWidth =  5;
        ctxCanvas.moveTo(fromx, fromy);
        ctxCanvas.lineTo(tox, toy);
        ctxCanvas.stroke();
        ctxCanvas.moveTo(tox, toy);
        ctxCanvas.lineTo(tox-arrowLen*Math.cos(angle-Math.PI/6),toy-arrowLen*Math.sin(angle-Math.PI/6));
        ctxCanvas.stroke();
        ctxCanvas.moveTo(tox, toy);
        ctxCanvas.lineTo(tox-arrowLen*Math.cos(angle+Math.PI/6),toy-arrowLen*Math.sin(angle+Math.PI/6));
        ctxCanvas.stroke();
        ctxCanvas.closePath();
    }

    const hexToRgb = (c) => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


    const paintCanvas = (e,form) => {
        if(activeIndex !== ''){
            let arrTest = [...data.arr];
            if(!stateButton.eraser && !stateButton.edit && !stateButton.arrow){
                arrTest[activeIndex].dots.push(mouse[0],mouse[1]);
                setData({ arr: arrTest});
                form.setFieldValue(props.code, data.arr);
            }
            if(stateButton.eraser){
                let updateArray = false;
                for (let i = 0; i<  arrTest[activeIndex].dots.length; i=i+2){
                    let dxArr = arrTest[activeIndex].dots[i] - mouse[0];
                    let dyArr = arrTest[activeIndex].dots[i+1] - mouse[1];
                    let distArr = Math.sqrt(dxArr * dxArr + dyArr * dyArr);
                    if(distArr < 10){
                        arrTest[activeIndex].dots.splice(i,2);
                        updateArray = true
                    }
                }
                for (let i = 0; i<  arrTest[activeIndex].arrow.length; i=i+2){
                    let dxArr = arrTest[activeIndex].arrow[i] - mouse[0];
                    let dyArr = arrTest[activeIndex].arrow[i+1] - mouse[1];
                    let distArr = Math.sqrt(dxArr * dxArr + dyArr * dyArr);
                    if(distArr < 10){
                        arrTest[activeIndex].arrow.splice(i,2);
                        updateArray = true
                    }
                }
                if(updateArray) {
                    setData({ arr: arrTest});
                    form.setFieldValue(props.code, data.arr);
                }
            }

            if(move) {
                arrTest[activeIndex].dots[indexMove] = mouse[0];
                arrTest[activeIndex].dots[indexMove + 1] = mouse[1];
                setData({ arr: arrTest});
                form.setFieldValue(props.code, data.arr);
                move = false;
                indexMove = null;
            }
            if(moveArrow) {
                arrTest[activeIndex].arrow[indexMoveArrow] = mouse[0];
                arrTest[activeIndex].arrow[indexMoveArrow + 1] = mouse[1];
                setData({ arr: arrTest});
                form.setFieldValue(props.code, data.arr);
                moveArrow = false;
                indexMoveArrow = null;
            }
            if(stateButton.arrow) {
                if(arrTest[activeIndex].arrow.length === 4) {
                    alert('Область может содержать только одно направление, для изменения перейдите в соответствуюшие пункты');
                    return
                }
                let testInPoly = inPoly(mouse[0],mouse[1], arrTest[activeIndex].dots);
                if(testInPoly) {
                    arrTest[activeIndex].arrow.push(mouse[0],mouse[1]);
                    setData({ arr: arrTest});
                    form.setFieldValue(props.code, data.arr);
                } else {
                    alert('Направление должно находиться внутри активной области')
                }
            }

        }
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

    const movePoint = (e) => {
        if(stateButton.edit){
            let arrTest = [...data.arr];
            for (let i = 0; i<  arrTest[activeIndex].dots.length; i=i+2){
                let dxArr = arrTest[activeIndex].dots[i] - mouse[0];
                let dyArr = arrTest[activeIndex].dots[i+1] - mouse[1];
                let distArr = Math.sqrt(dxArr * dxArr + dyArr * dyArr);
                if(distArr < 10){
                    move = true;
                    indexMove = i
                }
            }
            for (let i = 0; i<  arrTest[activeIndex].arrow.length; i=i+2){
                let dxArr = arrTest[activeIndex].arrow[i] - mouse[0];
                let dyArr = arrTest[activeIndex].arrow[i+1] - mouse[1];
                let distArr = Math.sqrt(dxArr * dxArr + dyArr * dyArr);
                if(distArr < 10){
                    moveArrow = true;
                    indexMoveArrow = i
                }
            }
        }
    };

    const mousePosition = (e) => {
        let rect = canvas.current.getBoundingClientRect();
        mouse = [e.clientX - rect.left,e.clientY - rect.top];
    };

    const deleteElement = (index,form) => {
        let arrTest = [...data.arr];
        arrTest.splice(index,1);
        setData({ arr: arrTest});
        form.setFieldValue(props.code, data.arr);
    };

    const panelActive = (type) => {
        if(type === 'area'){
            let cloneState = [...data.arr];
            let newLine = {
                "color": colorCanvas[0],
                "type": "arrow_area",
                "dots": [],
                "arrow": []
            };
            setIndex(()=> data.arr.length);
            cloneState.push(newLine);
            setData({arr: [...cloneState]});
        }
        if(type === 'areaSpeed'){
            let cloneState = [...data.arr];
            let newLine = {
                "color": colorCanvas[0],
                "type": "speed_arrow_area",
                "dots": [],
                "arrow": []
            };
            setIndex(()=> data.arr.length);
            cloneState.push(newLine);
            setData({arr: [...cloneState]});
        }
        if(type === 'edit' || type === 'eraser' ) {
            if(activeIndex === '') {
                alert('Для начала нужно выбрать создать или выбрать элемент');
                return
            }
            if(data.arr[activeIndex].dots.length === 0) {
                alert('У данного элемента нет точек');
                return
            }
        }
        setValueButton({
            [type]: !stateButton[type]
        })
    };
    const changeIndex = (ind) => {
        setIndex(() => ind)
    };
    const setNewColor = (e,ind,form) => {
        let newColor = e.target.value.slice(1);
        let cloneState = [...data.arr];
        cloneState[ind].color = newColor;
        setData({arr: [...cloneState]});
        form.setFieldValue(props.code, data.arr);
    };


    return (
        <div>

            <Field name={props.code}>
                {({
                      field,
                      form,
                      meta,
                  }) => (
                    <div className={"canvasGroup"}>
                        <label htmlFor={props.code}>{props.name}</label>
                        <canvas onMouseMove={(e) => mousePosition(e)}
                                onMouseUp={(e) => paintCanvas(e,form)}
                                onMouseDown={(e) => movePoint(e)}
                                ref={canvas}
                                id={props.code}>
                        </canvas>
                        <div className="canvasMenu">
                            <div className="panel">
                                <div className="panelItem" onClick={ () => panelActive('area')}>
                                    <img src="svg/area.svg" alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('areaSpeed')} className={stateButton.area ? '':'active'}>
                                    <img src="svg/areaSpeed.svg" alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('edit')} className={stateButton.edit ? '':'active'}>
                                    <img className={"imageActive"} src="svg/edit.svg" alt=""/>
                                    <img className={"imageDefault"} src="svg/editActive.svg" alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('arrow')} className={stateButton.arrow ? '':'active'}>
                                    <img className={"imageActive"} src="svg/arrow.svg" alt=""/>
                                    <img className={"imageDefault"} src="svg/arrowActive.svg" alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('eraser')} className={stateButton.eraser ? '':'active'}>
                                    <img className={"imageActive"} src="svg/eraser.svg" alt=""/>
                                    <img className={"imageDefault"} src="svg/eraserActive.svg" alt=""/>
                                </div>
                            </div>
                            <div className="items">
                                {
                                    data.arr.map((item,index)=>{
                                        return <div className={"item " + (activeIndex == index ?'active':'')}
                                                    key={index}
                                                    onClick={() => changeIndex(index)}
                                        >
                                            {(() => {
                                                    switch (item.type) {
                                                        case "arrow_area": return <div className={"itemLabel"}><img src="svg/area.svg" alt=""/>Область {index + 1}</div>;
                                                        case "speed_arrow_area": return <div className={"itemLabel"}><img src="svg/areaSpeed.svg" alt=""/>Область {index + 1}</div>;
                                                        default: return "-";
                                                    }
                                                }
                                            )()}
                                            <div className="color" style={{background: '#' + item.color}}>
                                                <input onChange={(e)=>{setNewColor(e,index,form)}} value={'#' + item.color} type="color"/>
                                            </div>
                                            <div className="deleteElement" onClick={() => deleteElement(index,form)}>&times;</div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        {meta.error && (
                            <div className="error">{meta.error}</div>
                        )}
                    </div>
                )}
            </Field>
        </div>
    )

}

export default ArrowAreasCanvasField
