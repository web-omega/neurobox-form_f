
import React, {Component, useEffect, useState,useRef} from 'react';
import {Field, useFormikContext} from "formik";
//import imgReq from './canvas/testImage.jpg'

function LinesAreasCanvasField(props) {

    const { values, submitForm } = useFormikContext();

    let imgReq = 'https://www.newsko.ru/media/6311833/dorogi-perm.jpg';
    let ctxCanvas = null;
    let imageTest = new Image();
    let canvasWidth = 0;
    let canvasHeight = 0;
    let originWidth = 0;
    let originHeight = 0;
    let mouse = [];
    let colorCanvas = [];
    let scaleImage = null;

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

            // let arrState = [...data.arr];
            // arrState.forEach(el=>{
            //     el.dots.forEach(coor=>{
            //         coor = coor*scaleImage;
            //     });
            // });
            // setData({ arr: arrState});
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
            if(el.type === 'line') {
                ctxCanvas.beginPath();
                ctxCanvas.moveTo(el.dots[0],el.dots[1]);
                for(let i = 0; i< el.dots.length; i = i + 2){
                    ctxCanvas.lineTo(el.dots[i],el.dots[i+1])
                }
                ctxCanvas.strokeStyle =  "#" + el.color;
                ctxCanvas.lineWidth =  3;
                ctxCanvas.stroke();
                ctxCanvas.closePath();
            }
            if(el.type === 'area') {

                ctxCanvas.beginPath();
                ctxCanvas.moveTo(el.dots[0],el.dots[1]);
                for(let i = 0; i< el.dots.length; i = i + 2){
                    ctxCanvas.lineTo(el.dots[i],el.dots[i+1])
                }
                ctxCanvas.lineTo(el.dots[0],el.dots[1]);
                let rgb = hexToRgb( "#" + el.color);
                let color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', .5)';
                ctxCanvas.strokeStyle = "#" + el.color;
                ctxCanvas.fillStyle = color;
                ctxCanvas.lineWidth =  3;
                ctxCanvas.fill();
                ctxCanvas.stroke();
                ctxCanvas.closePath();
            }

        });
    };
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
            if(!stateButton.eraser && !stateButton.edit){
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

        }
    };
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
                                <div className="panelItem" onClick={ () => panelActive('line')}>
                                    <img src="svg/line.svg" alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('area')} className={stateButton.area ? '':'active'}>
                                    <img src="svg/area.svg" alt=""/>
                                </div>
                                <div className="panelItem" onClick={ () => panelActive('edit')} className={stateButton.edit ? '':'active'}>
                                    <img className={"imageActive"} src="svg/edit.svg" alt=""/>
                                    <img className={"imageDefault"} src="svg/editActive.svg" alt=""/>
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
                                                        case "line": return <div className={"itemLabel"}><img src="svg/line.svg" alt=""/>Линия {index + 1}</div>;
                                                        case "area": return <div className={"itemLabel"}><img src="svg/area.svg" alt=""/>Область {index + 1}</div>;
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
export default LinesAreasCanvasField
