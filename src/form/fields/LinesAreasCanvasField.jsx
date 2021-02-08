
import React, {Component, useEffect, useState,useRef} from 'react';
import {Field, useFormikContext} from "formik";
import {convexShape,hexToRgb,lineIntersect} from './utils';
import area from './../../assets/area.svg';
import areaActive from './../../assets/areaActive.svg';
import line from './../../assets/line.svg';
import lineActive from './../../assets/lineActive.svg';
import edit from './../../assets/edit.svg';
import editActive from './../../assets/editActive.svg';
import eraser from './../../assets/eraser.svg';
import eraserActive from './../../assets/eraserActive.svg';

function LinesAreasCanvasField(props) {
    const form = useFormikContext();
    const { values, submitForm } = useFormikContext();

    let imgReq = 'https://www.newsko.ru/media/6311833/dorogi-perm.jpg';

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
    let scaleImage = useRef('');

    let move = false;
    let indexMove = null;



    const canvas = useRef(null);

    const [data, setData] = useState({
        arr: values.lines_and_areas && values.lines_and_areas.length > 0 ? values.lines_and_areas : []
    });
    const [activeIndex, setIndex] = useState('');

    const [stateButton,setValueButton] = useState({
        line: false,
        area: false,
        edit: false,
        eraser: false
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
                scaleImage.current =  originWidth/canvasWidth.current;

                let copy =  JSON.parse(JSON.stringify(data));

                copy.arr.forEach(el=>{
                    el.dots = el.dots.map((e)=> Math.round(e / scaleImage.current))
                })
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
            if(el.type === 'line') {
                ctxCanvas.current.beginPath();
                ctxCanvas.current.lineWidth =  2;
                ctxCanvas.current.moveTo(el.dots[0],el.dots[1]);
                for(let i = 0; i< el.dots.length; i = i + 2){
                    ctxCanvas.current.lineTo(el.dots[i],el.dots[i+1])
                }
                ctxCanvas.current.strokeStyle =  "#" + el.color;
                ctxCanvas.current.lineWidth =  2;
                ctxCanvas.current.stroke();
                ctxCanvas.current.closePath();
            }
            if(el.type === 'area') {

                ctxCanvas.current.beginPath();
                ctxCanvas.current.lineWidth =  2;
                ctxCanvas.current.moveTo(el.dots[0],el.dots[1]);
                for(let i = 0; i< el.dots.length; i = i + 2){
                    ctxCanvas.current.lineTo(el.dots[i],el.dots[i+1])
                }
                ctxCanvas.current.lineTo(el.dots[0],el.dots[1]);
                let rgb = hexToRgb( "#" + el.color);
                let color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', .3)';
                ctxCanvas.current.strokeStyle = "#" + el.color;
                ctxCanvas.current.fillStyle = color;
                ctxCanvas.current.lineWidth =  2;
                ctxCanvas.current.fill();
                ctxCanvas.current.stroke();
                ctxCanvas.current.closePath();
            }

        });
    };

    const checkLine = (arrTest)=> {
        let n = (arrTest[activeIndex].dots.length + 1);

        let errorElemEmpty = errorMessage.current.findIndex(el => el.index === activeIndex && el.type === 'lineEmpty');
        let errorElem = errorMessage.current.findIndex(el => el.index === activeIndex && el.type === 'line');

        if(n <= 3 && errorElemEmpty === -1) {
            errorMessage.current.push({
                type: 'lineEmpty',
                index: activeIndex,
                message: 'Линия ' + (activeIndex + 1) + ' должна стостоять минимум из двух точек.'
            })
            return
        } else if ( n <=3 && errorElem != -1 ) {
            errorMessage.current[errorElem].message = 'Линия ' + (activeIndex + 1) + ' должна стостоять минимум из двух точек.'
            errorMessage.current[errorElem].type = 'lineEmpty'
            return
        } else if(n > 3 && errorElemEmpty != -1) errorMessage.current.splice(errorElem,1)

        let intersect = false;
        for (let i = 0; i < n - 1; i=i+2) {
            for (let j = 0; j < n - 1; j=j+2) {
                let test =  lineIntersect(
                    arrTest[activeIndex].dots[i],
                    arrTest[activeIndex].dots[i+1],
                    arrTest[activeIndex].dots[i+2],
                    arrTest[activeIndex].dots[i+3],
                    arrTest[activeIndex].dots[j],
                    arrTest[activeIndex].dots[j+1],
                    arrTest[activeIndex].dots[j+2],
                    arrTest[activeIndex].dots[j+3]);
                if(test.result) intersect = true
            }
        }

        if(intersect && errorElem == '-1') {
            errorMessage.current.push({
                type: 'line',
                index: activeIndex,
                message: 'Линия ' + (activeIndex + 1) + ' пересекает саму себя.'
            })
        } else if(!intersect && errorElem != '-1') errorMessage.current.splice(errorElem,1)
    };

    const checkArea = (arrTest) => {
        let errorElem = errorMessage.current.findIndex(el => el.index === activeIndex && el.type === 'area');
        let errorElemEmpty = errorMessage.current.findIndex(el => el.index === activeIndex && el.type === 'areaEmpty');

        if (arrTest[activeIndex].dots.length < 5 && errorElemEmpty === -1) {
            errorMessage.current.push({
                type: 'areaEmpty',
                index: activeIndex,
                message: 'Фигура ' + (activeIndex + 1) + ' должна состоять минимум из трёх точек.'
            });
            return
        } else if(arrTest[activeIndex].dots.length < 5 && errorElem != -1) {
            errorMessage.current[errorElem].message = 'Фигура ' + (activeIndex + 1) + ' должна состоять минимум из трёх точек.'
            errorMessage.current[errorElem].type = 'areaEmpty'
            return
        } else if(arrTest[activeIndex].dots.length < 5 && errorElemEmpty != -1) {
            return
        } else if (arrTest[activeIndex].dots.length >= 5 && errorElemEmpty != -1) errorMessage.current.splice(errorElemEmpty,1)


        let checkConvex = convexShape(arrTest[activeIndex].dots)
        if (!checkConvex && errorElem == '-1') {
            errorMessage.current.push({
                type: 'area',
                index: activeIndex,
                message: 'Фигура ' + (activeIndex + 1) + ' не выпуклая.'
            });
        } else if(checkConvex && errorElem != '-1') errorMessage.current.splice(errorElem,1)
    };

    const saveValue = (arrTest)=>{
        setData({ arr: arrTest});
        let copy =  JSON.parse(JSON.stringify(data));
        copy.arr.forEach(el=>{
            el.dots = el.dots.map((e)=> Math.round(e * scaleImage.current))
        })
        form.setFieldValue(props.code, copy.arr);
    };


    const paintCanvas = () => {

        if(activeIndex !== ''){
            let arrTest = [...data.arr];
            if(!stateButton.eraser && !stateButton.edit){
                arrTest[activeIndex].dots.push(mouse[0],mouse[1]);
                if(arrTest[activeIndex].type === 'line') {
                    checkLine(arrTest)
                }
                if(arrTest[activeIndex].type === 'area') {
                    checkArea(arrTest);
                }
                saveValue(arrTest);
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
                        if( arrTest[activeIndex].type === 'line') checkLine(arrTest);
                        if( arrTest[activeIndex].type === 'area') checkArea(arrTest);
                    }
                }
                if(updateArray) saveValue(arrTest);
            }

            if(move) {
                if( arrTest[activeIndex].type === 'line') checkLine(arrTest);
                if( arrTest[activeIndex].type === 'area') checkArea(arrTest);
                arrTest[activeIndex].dots[indexMove] = mouse[0];
                arrTest[activeIndex].dots[indexMove + 1] = mouse[1];
                saveValue(arrTest);
                move = false;
                indexMove = null;
            }
        }
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
    };

    const deleteElement = (index,e) => {
        e.stopPropagation();
        let arrTest = [...data.arr];
        let errorElem = errorMessage.current.findIndex(el => el.index === index);

        errorMessage.current.forEach(el=>{
            if(index <  el.index) {
                let indString = el.message.indexOf(String(el.index + 1));
                el.message = el.message.substr(0, indString) + ( el.index-- ) + el.message.substr(indString + 1);
                el.index = el.index--;
            }
        });
        if(errorElem != '-1') {
            errorMessage.current.splice(errorElem,1);
        }
        setValueButton({
            line: false,
            area: false,
            edit: false,
            eraser: false,
        });
        setIndex(() => '');
        cursor.current = '';
        arrTest.splice(index,1);
        saveValue(arrTest)

    };

    const panelActive = (type) => {
        if(type === 'line'){
            let cloneState = [...data.arr];
            let newLine = {
                "color": colorCanvas[0],
                "type": "line",
                "dots": []
            };
            setIndex(()=> data.arr.length);
            cloneState.push(newLine);
            setData({arr: [...cloneState]});
        }
        if(type === 'area'){
            let cloneState = [...data.arr];
            let newLine = {
                "color": colorCanvas[0],
                "type": "area",
                "dots": []
            };
            setIndex(()=> data.arr.length);
            cloneState.push(newLine);
            setData({arr: [...cloneState]});
        }
        if(stateButton[type]){
            setValueButton({
                [type]: !stateButton[type]
            });
            cursor.current = data.arr[activeIndex].type === 'line' ? 'line':'area'
            return
        }
        if((type === 'edit' || type === 'eraser') && (activeIndex === '' || data.arr[activeIndex].dots.length === 0)) return

        cursor.current = type;
        setValueButton({
            [type]: !stateButton[type]
        })
    };
    const changeIndex = (ind) => {
        setIndex(() => ind);
        setValueButton({
            line: false,
            area: false,
            edit: false,
            eraser: false,
        });
        cursor.current = data.arr[ind].type === 'line' ? 'line':'area'
    };
    const setNewColor = (e,ind) => {
        let newColor = e.target.value.slice(1);
        let cloneState = [...data.arr];
        cloneState[ind].color = newColor;
        setData({arr: [...cloneState]});

        let copy =  JSON.parse(JSON.stringify(data));
        copy.arr.forEach(el=>{
            el.dots = el.dots.map((e)=> Math.round(e * scaleImage.current))
        })
        form.setFieldValue(props.code, copy.arr);
    };


    return (
        <div>

            <Field name={props.code} validate={(value)=>{
                return errorMessage.current.length > 0;
            }}>
                {({
                      form,
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
                                <div className="panelItem" onClick={ () => panelActive('line')}>
                                    <img src={line} alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('area')} className={stateButton.area ? '':'active'}>
                                    <img src={area} alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('edit')} className={stateButton.edit ? '':'active'}>
                                    <img className={"imageActive"} src={edit} alt=""/>
                                    <img className={"imageDefault"} src={editActive} alt=""/>
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
                                                        case "line": return <div className={"itemLabel"}><img src={line} alt=""/>Линия {index + 1}</div>;
                                                        case "area": return <div className={"itemLabel"}><img src={area} alt=""/>Фигура {index + 1}</div>;
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
export default LinesAreasCanvasField
