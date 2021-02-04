import React, {Component,useRef,useEffect} from 'react';

import {Field, useFormikContext} from 'formik';

function RangeField(props) {
    const form = useFormikContext();
    let errorInput = useRef('');

    let mouseStart = useRef('');
    let activeType = useRef('');
    let mouseStartEvent = useRef(false);
    let slider = useRef(null);
    let widthSlide = useRef('');
    let rect = useRef(null);
    let maxValue = useRef(0);
    let minValue = useRef(0);

    useEffect(()=>{
        errorInput.current = '';
        rect.current = slider.current.getBoundingClientRect();
        maxValue.current = props.parameters.max ?? form.values[props.parameters.max_key];
        minValue.current = props.parameters.min ?? form.values[props.parameters.minKey];
        if(maxValue.current <= minValue.current) {
            errorInput.current = 'Ошибка зависимых полей '
        } else {
            if(maxValue.current < form.values[props.code].max || form.values[props.code].max < minValue.current) {
                form.setFieldValue(props.code + '.max', + maxValue.current);
            }
            if(minValue.current > form.values[props.code].min || form.values[props.code].min > maxValue.current) {
                form.setFieldValue(props.code + '.min', + minValue.current);
            }
        }

    });

    const mouseMove = (e,click)=>{
        if(mouseStartEvent.current || click){
            let x = Math.round((e.clientX - rect.current.left));
            let koof = (maxValue.current - minValue.current) / 100;

            let result = (Math.round((x/widthSlide.current * 100) * koof / props.parameters.step)) * props.parameters.step + minValue.current;

            if( activeType.current === '.min' && result >= minValue.current && result < form.values[props.code].max){
                form.setFieldValue(props.code + activeType.current, +result);
            }
            if( activeType.current === '.max' && result > form.values[props.code].min && result <= maxValue.current){
                form.setFieldValue(props.code + activeType.current, +result);
            }
        }
    }
    const changeSelect = (e)=>{

        let x = Math.round((e.clientX - rect.current.left));
        widthSlide.current = rect.current.width;
        let koof = (maxValue.current - minValue.current) / 100;
        let result = (Math.round((x/widthSlide.current * 100) * koof / props.parameters.step)) * props.parameters.step + minValue.current;


        let p = Math.abs(result - form.values[props.code].min);
        let p2 =Math.abs( form.values[props.code].max - result);

        if (p < p2) activeType.current = '.min';
        else if (p > p2) activeType.current = '.max';
        else activeType.current = '.min';

        mouseMove(e,true)

        //mouseMove(e, true)
    };
    const mouseDown = (e,type,field)=>{
        activeType.current = type;
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
                        <div className={"fakeSlider fakeSliderMultiple"} ref={slider}  onClick={(e)=> changeSelect(e)}>
                            <div className={"selectNew selectNewMin"} style={{
                                width: ((form.values[props.code].min - props.parameters.min ?? form.values[props.parameters.minKey])/((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 + '%')}}>
                            </div>
                            <div className={`selectActive  ${activeType.current === '.min'? 'selectActiveMin':'selectActiveMax'}`}  style={{
                                width: (100 - ((form.values[props.code].min - props.parameters.min ?? form.values[props.parameters.minKey])/((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 ) - (100 - ((form.values[props.code].max  - props.parameters.min ?? form.values[props.parameters.minKey])/((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100)) + '%')}}>
                            </div>
                            <div className={"selectNew selectNewMax"} style={{
                                width: (100 - ((form.values[props.code].max  - props.parameters.min ?? form.values[props.parameters.minKey])/((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100) + '%')}}>
                            </div>
                            <div className="thumb" style={{
                                left: ((form.values[props.code].min - props.parameters.min ?? form.values[props.parameters.minKey]) / ((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 + '%')
                            }}
                                 onMouseDown={(e) => mouseDown(e,'.min',field)}
                            >
                            </div>
                            <div className="thumb" style={{
                                left: ((form.values[props.code].max - props.parameters.min ?? form.values[props.parameters.minKey]) / ((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 + '%')
                            }}
                                 onMouseDown={(e) => mouseDown(e,'.max', )}
                            >
                            </div>
                        </div>
                    </div>

                    <div className="labelValueWrap">
                        <div className={"labelMultiple"}>
                            <div className="min">{props.parameters.min ?? form.values[props.parameters.min_key]}</div>
                            <div className="value"
                                 style={{left:((form.values[props.code].min - props.parameters.min ?? form.values[props.parameters.minKey]) / ((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 + '%')
                            }}>{field.value.min}</div>
                            <div className="value"
                                 style={{left: ((form.values[props.code].max - props.parameters.min ?? form.values[props.parameters.minKey]) / ((props.parameters.max ?? form.values[props.parameters.max_key]) - (props.parameters.min ?? form.values[props.parameters.minKey])) * 100 + '%')
                                 }}>{field.value.max}</div>
                            <div className="max">{props.parameters.max ?? form.values[props.parameters.max_key]}</div>
                        </div>
                    </div>
                    {meta.error && (
                        <div className="error">{meta.error}</div>
                    )}

                </div>
            )}
        </Field>
    )

}
export default RangeField
