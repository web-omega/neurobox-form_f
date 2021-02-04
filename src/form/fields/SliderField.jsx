import React, {Component,useRef,useEffect} from 'react';

import {Field, useFormikContext} from 'formik';


function SliderField(props) {
    const form = useFormikContext();


    let errorInput = useRef('');

    let mouseStart = useRef('');
    let mouseStartEvent = useRef(false);
    let slider = useRef(null);
    let widthSlide = useRef('');
    let rect = useRef(null);
    let maxValue = useRef(props.parameters.max ?? form.values[props.parameters.max_key]);
    let minValue = useRef(props.parameters.min ?? form.values[props.parameters.minKey]);


    useEffect(()=>{
        //errorInput.current = '';
        rect.current = slider.current.getBoundingClientRect();
        maxValue.current = props.parameters.max ?? form.values[props.parameters.max_key];
        minValue.current = props.parameters.min ?? form.values[props.parameters.minKey];


        if(maxValue.current <= minValue.current) {
            //"Ошибка зависимых значений. Исправьте поле fieldName"
            errorInput.current = 'Ошибка зависимого поля '
        } else {

            errorInput.current = '';
            if(maxValue.current < form.values[props.code]) {
                form.setFieldValue(props.code , + maxValue.current);
            }
            if(minValue.current > form.values[props.code]) {
                form.setFieldValue(props.code, + minValue.current);
            }
        }
    });

    const mouseMove = (e, click)=>{
        if(mouseStartEvent.current || click){
            let x = Math.round((e.clientX - rect.current.left));
            let koof = (maxValue.current - minValue.current) / 100;
            let result = (Math.round((x/widthSlide.current * 100) * koof / props.parameters.step)) * props.parameters.step + minValue.current;
            if( result >= minValue.current && result <= maxValue.current){
                form.setFieldValue(props.code, +result);
            }
        }
    }
    const changeSelect = (e)=>{
        mouseMove(e, true)
    }
    const mouseDown = (e)=>{
        widthSlide.current = rect.current.width;
        mouseStart.current = Math.round((e.clientX - rect.current.left));
        mouseStartEvent.current = true;
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mousemove', mouseMove);
    }
    const mouseUp = (e)=>{
        mouseStartEvent.current = false;
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('mousemove', mouseMove);
    }
    return (
        <Field name={props.code} validate={(value)=>{
            return errorInput.current;
        }}>
            {({
                  field,
                  form,
                  meta,
              }) => (
                <div className={"inputGroup"}>
                    <label htmlFor={props.code}>{props.name}</label>
                    <div className="fakeSliderWrap">
                        <div className={"fakeSlider"} ref={slider} onClick={(e)=> changeSelect(e)}>
                            <div className={"selectActive"} style={{
                                width: ((field.value - props.parameters.min ?? form.values[props.parameters.minKey])/((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 + '%')}}>
                            </div>
                            <div className={"selectNew"} style={{
                                width: (100 - ((field.value - props.parameters.min ?? form.values[props.parameters.minKey])/((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100) + '%')}}>
                            </div>
                            <div className="thumb" style={{
                                left: ((field.value - props.parameters.min ?? form.values[props.parameters.minKey]) / ((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 + '%')
                            }}
                                onMouseDown={(e) => mouseDown(e,field)}
                            >
                            </div>
                        </div>
                    </div>
                    <div className="labelValueWrap">
                        <div className="labelValue">
                            <div className="min">{props.parameters.min ?? form.values[props.parameters.minKey]}</div>
                            <div className="value" style={{left: ((field.value - props.parameters.min ?? form.values[props.parameters.minKey]) / ((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 + '%')}}>{field.value}</div>
                            <div className="max">{props.parameters.max ?? form.values[props.parameters.max_key]}</div>
                        </div>
                    </div>
                    {meta.error && (
                        <div className="error">{meta.error}</div>
                    )}
                </div>
            )}
        </Field>
    );
}

export default SliderField
