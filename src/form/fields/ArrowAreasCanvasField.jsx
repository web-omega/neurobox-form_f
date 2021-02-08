import React, {Component, useEffect, useState,useRef} from 'react';
import {Field, useFormikContext} from "formik";
import {convexShape,hexToRgb,inPoly} from './utils'
import area from './../../assets/area.svg';
import areaSpeed from './../../assets/areaSpeed.svg';
import edit from './../../assets/edit.svg';
import editActive from './../../assets/editActive.svg';
import arrow from './../../assets/arrow.svg';
import arrowActive from './../../assets/arrowActive.svg';
import eraser from './../../assets/eraser.svg';
import eraserActive from './../../assets/eraserActive.svg';

function ArrowAreasCanvasField(props) {

    const form = useFormikContext();

    let imgReq = 'https://mtdi.mosreg.ru/upload/files/g/i/gio9SFV0y7O9ZsNltS5E62m8vYlN7Y2OBMUSoP6F7lej2dgikbj1X14lv0yV8ymCPdCV6egCP1UzkAjCtWHkzrZQyrDybUU6.jpg'
    const { values, submitForm } = useFormikContext();



    let ctxCanvas = useRef(null);
    let errorMessage = useRef([]);
    let imageTest = useRef(new Image());
    const canvasWidth = useRef(600);
    const canvasHeight = useRef('');
    let loadImage = useRef(false);
    let cursor = useRef('');
    let originWidth = 0;
    let originHeight = 0;
    let mouse = [];
    let colorCanvas = [];

    let move = false;
    let indexMove = null;
    let moveArrow = false;
    let indexMoveArrow = null;
    let scaleImage = useRef('');

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
        if(!loadImage.current){
            ctxCanvas.current = canvas.current.getContext('2d');
            imageTest.current.src = imgReq;
            imageTest.current.onload = () => {
                originWidth = imageTest.current.width;
                originHeight = imageTest.current.height;
                canvasHeight.current = originHeight * ( canvasWidth.current/originWidth );

                canvas.current.height = canvasHeight.current;
                canvas.current.width = canvasWidth.current;
                scaleImage.current = originWidth/canvasWidth.current;

                let copy =  JSON.parse(JSON.stringify(data));
                copy.arr.forEach(el=>{
                    el.dots = el.dots.map((e)=> Math.round(e / scaleImage.current))
                    el.arrow = el.arrow.map((e)=> Math.round(e / scaleImage.current))
                });
                if(copy.arr.length > 0) setIndex(()=> 0)
                setData({ arr: copy.arr});

                canvasRender(data);
                loadImage.current = true
            }
        } else canvasRender(data);

    },[data]);

    for (let i = 0; i < 30; i++){
        let color = Math.floor((Math.random()*10000000)+1);
        if(colorCanvas.indexOf(color) <= 0) colorCanvas.push(("000000" + color.toString(16)).slice(-6));
    }

    const canvasRender = (data) => {

        ctxCanvas.current.clearRect(0, 0, canvasWidth.current, canvasHeight.current);
        ctxCanvas.current.drawImage(imageTest.current, 0, 0, canvasWidth.current, canvasHeight.current);

        data.arr.forEach(el=>{
            ctxCanvas.current.beginPath();
            for(let i = 0; i< el.dots.length; i = i + 2){
                ctxCanvas.current.beginPath();
                ctxCanvas.current.lineWidth =  2;
                ctxCanvas.current.fillStyle = "#" + el.color;
                ctxCanvas.current.arc(el.dots[i], el.dots[i+1], 5, 0, 2*Math.PI);
                ctxCanvas.current.fill();
            }
            ctxCanvas.current.closePath();

            if(el.type === 'speed_arrow_area' || el.type ===  'arrow_area' ) {

                ctxCanvas.current.beginPath();
                ctxCanvas.current.moveTo(el.dots[0],el.dots[1]);
                for(let i = 0; i< el.dots.length; i = i + 2){
                    ctxCanvas.current.lineTo(el.dots[i],el.dots[i+1])
                }
                ctxCanvas.current.lineTo(el.dots[0],el.dots[1]);
                let rgb = hexToRgb( "#" + el.color);
                let color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', .3)';
                ctxCanvas.current.fillStyle = color ;
                ctxCanvas.current.strokeStyle = "#" + el.color ;
                ctxCanvas.current.lineWidth =  2;
                ctxCanvas.current.fill();
                ctxCanvas.current.stroke();
                ctxCanvas.current.closePath();

                ctxCanvas.current.beginPath();
                ctxCanvas.current.fillStyle = el.color ;
                for(let i = 0; i< el.arrow.length; i = i + 2){
                    ctxCanvas.current.arc(el.arrow[i], el.arrow[i+1], 4, 0, 2*Math.PI);
                }
                ctxCanvas.current.fill();
                ctxCanvas.current.closePath();
                if(el.arrow.length === 4) canvasArrow(el.arrow[0],el.arrow[1],el.arrow[2],el.arrow[3])
            }

        });
    };
    const canvasArrow = (fromx, fromy, tox, toy) =>{
        let arrowLen = 15;
        let dx = tox-fromx;
        let dy = toy-fromy;
        let angle = Math.atan2(dy,dx);
        ctxCanvas.current.beginPath();

        ctxCanvas.current.lineWidth =  2;
        ctxCanvas.current.moveTo(fromx, fromy);
        ctxCanvas.current.lineTo(tox, toy);
        ctxCanvas.current.stroke();
        ctxCanvas.current.moveTo(tox, toy);
        ctxCanvas.current.lineTo(tox-arrowLen*Math.cos(angle-Math.PI/6),toy-arrowLen*Math.sin(angle-Math.PI/6));
        ctxCanvas.current.stroke();
        ctxCanvas.current.moveTo(tox, toy);
        ctxCanvas.current.lineTo(tox-arrowLen*Math.cos(angle+Math.PI/6),toy-arrowLen*Math.sin(angle+Math.PI/6));
        ctxCanvas.current.stroke();
        ctxCanvas.current.closePath();
    };

    const checkValidateArea = (arrTest) => {
        let errorElem = errorMessage.current.findIndex(el => el.index === activeIndex && el.type === 'area');
        let errorElemEmpty = errorMessage.current.findIndex(el => el.index === activeIndex && el.type === 'areaEmpty');
        arrowInPoly(arrTest);

        if (arrTest[activeIndex].dots.length < 5 && errorElemEmpty === -1) {
            errorMessage.current.push({
                type: 'areaEmpty',
                index: activeIndex,
                message: 'Фигура ' + (activeIndex + 1) + ' должна состоять минимум из трёх точек.'
            });
            return
        }
        if(arrTest[activeIndex].dots.length < 5 && errorElem != -1) {
            errorMessage.current[errorElem].message = 'Фигура ' + (activeIndex + 1) + ' должна состоять минимум из трёх точек.'
            errorMessage.current[errorElem].type = 'areaEmpty'
            return
        }
        if(arrTest[activeIndex].dots.length < 5 && errorElemEmpty != -1) {
            return
        }
        if (arrTest[activeIndex].dots.length >= 5 && errorElemEmpty != -1) {
            errorMessage.current.splice(errorElemEmpty,1)
        }
        let checkConvex = convexShape(arrTest[activeIndex].dots)
        if (!checkConvex && errorElem == '-1') {
            errorMessage.current.push({
                type: 'area',
                index: activeIndex,
                message: 'Фигура ' + (activeIndex + 1) + ' не выпуклая.'
            });
            return
        } else if(checkConvex && errorElem != '-1') {
            errorMessage.current.splice(errorElem,1);
        }


    }
    const arrowInPoly = (arrTest)=>{

        let testInPoly = true;
        if(arrTest[activeIndex].arrow.length === 4) {
            testInPoly = inPoly(arrTest[activeIndex].arrow[0],arrTest[activeIndex].arrow[1], arrTest[activeIndex].dots) && inPoly(arrTest[activeIndex].arrow[2],arrTest[activeIndex].arrow[3], arrTest[activeIndex].dots);
            let errorCount = errorMessage.current.findIndex(el => el.index === activeIndex && el.type === 'arrow' && el.arrowCount);
            if(errorCount !== -1) errorMessage.current.splice(errorCount,1)
        }
        let errorElem = errorMessage.current.findIndex(el => el.index === activeIndex && el.type === 'arrow');
        if(arrTest[activeIndex].arrow.length === 2){
            errorMessage.current.push({
                type: 'arrow',
                index: activeIndex,
                arrowCount: true,
                message: 'Направление не может содержать только одну точку (Фигура ' + (activeIndex + 1) + ')'
            });
            return
        }
        if (!testInPoly && errorElem == '-1') {
            errorMessage.current.push({
                type: 'arrow',
                index: activeIndex,
                message: 'Направление должно находиться внутри активной области (Фигура ' + (activeIndex + 1) + ')'
            });
            return
        } else if(testInPoly && errorElem != '-1') errorMessage.current.splice(errorElem,1);

    };
    const saveValue = (arrTest)=>{
        setData({ arr: arrTest});
        let copy =  JSON.parse(JSON.stringify(data));
        copy.arr.forEach(el=>{
            el.dots = el.dots.map((e)=> Math.round(e * scaleImage.current))
            el.arrow = el.arrow.map((e)=> Math.round(e * scaleImage.current))
        })
        form.setFieldValue(props.code, copy.arr);
    };


    const paintCanvas = () => {

        if(activeIndex !== ''){
            let arrTest = [...data.arr];
            if(!stateButton.eraser && !stateButton.edit && !stateButton.arrow){
                arrTest[activeIndex].dots.push(mouse[0],mouse[1]);
                checkValidateArea(arrTest);
                saveValue(arrTest)
            }
            if(stateButton.eraser){
                let updateArray = false;
                for (let i = 0; i<  arrTest[activeIndex].dots.length; i=i+2){
                    let dxArr = arrTest[activeIndex].dots[i] - mouse[0];
                    let dyArr = arrTest[activeIndex].dots[i+1] - mouse[1];
                    let distArr = Math.sqrt(dxArr * dxArr + dyArr * dyArr);
                    if(distArr < 10){
                        arrTest[activeIndex].dots.splice(i,2);
                        updateArray = true;
                        checkValidateArea(arrTest);
                    }
                }
                for (let i = 0; i<  arrTest[activeIndex].arrow.length; i=i+2){
                    let dxArr = arrTest[activeIndex].arrow[i] - mouse[0];
                    let dyArr = arrTest[activeIndex].arrow[i+1] - mouse[1];
                    let distArr = Math.sqrt(dxArr * dxArr + dyArr * dyArr);
                    if(distArr < 10){
                        arrTest[activeIndex].arrow.splice(i,2);
                        updateArray = true;
                        checkValidateArea(arrTest)
                    }
                }
                if(updateArray) saveValue(arrTest)
            }
            if(move) {
                arrTest[activeIndex].dots[indexMove] = mouse[0];
                arrTest[activeIndex].dots[indexMove + 1] = mouse[1];
                checkValidateArea(arrTest);
                saveValue(arrTest);
                move = false;
                indexMove = null;
            }
            if(moveArrow) {
                arrTest[activeIndex].arrow[indexMoveArrow] = mouse[0];
                arrTest[activeIndex].arrow[indexMoveArrow + 1] = mouse[1];
                checkValidateArea(arrTest);
                saveValue(arrTest);

                moveArrow = false;
                indexMoveArrow = null;
            }
            if(stateButton.arrow) {
                if(arrTest[activeIndex].arrow.length === 4) return

                arrTest[activeIndex].arrow.push(mouse[0]);
                arrTest[activeIndex].arrow.push(mouse[1]);
                checkValidateArea(arrTest);
                saveValue(arrTest);
            }

        }
        canvasRender(data);
    };



    const movePoint = (e) => {
        if(stateButton.edit && activeIndex !== ''){
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
        mouse = [Math.round((e.clientX - rect.left)),Math.round((e.clientY - rect.top))];
        if(move) {
            let arrTest = [...data.arr];
            arrTest[activeIndex].dots[indexMove] = mouse[0];
            arrTest[activeIndex].dots[indexMove + 1] = mouse[1];
            canvasRender({arr: arrTest});
        }
        if(moveArrow) {
            let arrTest = [...data.arr];
            arrTest[activeIndex].arrow[indexMoveArrow] = mouse[0];
            arrTest[activeIndex].arrow[indexMoveArrow + 1] = mouse[1];
            canvasRender({arr: arrTest});
        }
    };
    const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el.index === val ? [...acc, i] : acc), []);

    const deleteElement = (index,e) => {
        e.stopPropagation();
        let arrTest = [...data.arr];
        let errorElem = errorMessage.current.findIndex(el => el.index === index);
        let errorElem2 = indexOfAll(errorMessage.current, index);

        errorMessage.current.forEach(el=>{
            if(index <  el.index) {
                let indString = el.message.indexOf(String(el.index + 1));
                el.message = el.message.substr(0, indString) + ( el.index-- ) + el.message.substr(indString + 1);
                el.index = el.index--;
            }
        });
        if(errorElem2.length > 0) {
            errorElem2.reverse().forEach(el=>{
                errorMessage.current.splice(el,1);
            });

        }
        setValueButton({
            areaSpeed: false,
            area: false,
            edit: false,
            eraser: false,
            arrow: false
        });
        setIndex(()=>'');
        cursor.current = '';
        arrTest.splice(index,1);
        saveValue(arrTest)
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
        if(stateButton[type]){
            setValueButton({
                [type]: !stateButton[type]
            });
            cursor.current = data.arr[activeIndex].type === 'arrow_area' ? 'area':'areaSpeed';
            return
        }

        if(type === 'edit' || type === 'eraser' ) {
            if(activeIndex === '') {
                return
            }
            if(data.arr[activeIndex].dots.length === 0 && data.arr[activeIndex].arrow.length === 0) {
                return
            }
        }
        if(type === 'arrow' && activeIndex === '') return
        cursor.current = type;
        setValueButton({
            [type]: !stateButton[type]
        })
    };
    const changeIndex = (ind) => {
        setValueButton({
            areaSpeed: false,
            area: false,
            edit: false,
            eraser: false,
            arrow: false
        });
        cursor.current = data.arr[ind].type === 'arrow_area' ? 'area':'areaSpeed'
        setIndex(() => ind)
    };
    const setNewColor = (e,ind) => {
        let newColor = e.target.value.slice(1);
        let cloneState = [...data.arr];
        cloneState[ind].color = newColor;
        setData({arr: [...cloneState]});
        let copy =  JSON.parse(JSON.stringify(data));
        copy.arr.forEach(el=>{
            el.dots = el.dots.map((e)=> Math.round(e * scaleImage.current))
            el.arrow = el.arrow.map((e)=> Math.round(e * scaleImage.current))
        })
        form.setFieldValue(props.code, copy.arr);
    };


    return (
        <div>
            <Field name={props.code} validate={(value)=>{
                return errorMessage.current.length > 0;
            }}>
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
                                id={props.code}
                                className={cursor.current}
                        >
                        </canvas>
                        <div className="canvasMenu" style={{maxHeight:  canvasHeight.current + 'px'}}>
                            <div className="panel">
                                <div className="panelItem" onClick={ () => panelActive('area')}>
                                    <img src={area} alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('areaSpeed')} className={stateButton.area ? '':'active'}>
                                    <img src={areaSpeed} alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('edit')} className={stateButton.edit ? '':'active'}>
                                    <img className={"imageActive"} src={edit} alt=""/>
                                    <img className={"imageDefault"} src={editActive} alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('arrow')} className={stateButton.arrow ? '':'active'}>
                                    <img className={"imageActive"} src={arrow} alt=""/>
                                    <img className={"imageDefault"} src={arrowActive} alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('eraser')} className={stateButton.eraser ? '':'active'}>
                                    <img className={"imageActive"} src={eraser} alt=""/>
                                    <img className={"imageDefault"} src={eraserActive} alt=""/>
                                </div>
                            </div>
                            <div className="items">
                                {
                                    data.arr.map((item,index)=>{
                                        return <div className={"item " + (activeIndex === index ?'active':'')}
                                                    key={index}
                                                    onClick={() => changeIndex(index)}
                                        >
                                            {(() => {
                                                    switch (item.type) {
                                                        case "arrow_area": return <div className={"itemLabel"}><img src={area} alt=""/>Фигура {index + 1}</div>;
                                                        case "speed_arrow_area": return <div className={"itemLabel"}><img src={areaSpeed} alt=""/>Фигура {index + 1}</div>;
                                                        default: return "-";
                                                    }
                                                }
                                            )()}
                                            <div className="color" style={{background: '#' + item.color}}>
                                                <input onChange={(e)=>{setNewColor(e,index,form)}} value={'#' + item.color} type="color"/>
                                            </div>
                                            <div className="deleteElement" onClick={(e) => deleteElement(index,e)}>&times;</div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="errorWrap">
                            {errorMessage.current.length > 0 && (
                                errorMessage.current.map((item, index) => {
                                    return <div className="error" key={index}>{item.message}</div>
                                })
                            )}
                        </div>
                    </div>
                )}
            </Field>
        </div>
    )

}

export default ArrowAreasCanvasField
