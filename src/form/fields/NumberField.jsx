import React, {Component,useRef,useEffect} from 'react';

import {Field, useFormikContext} from 'formik';

function NumberField(props) {
    const form = useFormikContext();

    let errorInput = useRef('');
    let maxValue = useRef(0);
    let minValue = useRef(0);


    useEffect(()=>{
        errorInput.current = '';
        maxValue.current = props.parameters.max ?? form.values[props.parameters.max_key];
        minValue.current = props.parameters.min ?? form.values[props.parameters.minKey];
        if(maxValue.current <= minValue.current) {
            errorInput.current = 'Ошибка зависимых значений.'
        } else {
            if(maxValue.current < form.values[props.code]) {
                form.setFieldValue(props.code, + maxValue.current);
            }
            if(minValue.current > form.values[props.code]) {
                form.setFieldValue(props.code, + minValue.current);
            }
        }

    })


    const SetUpTest = (e,form,field) => {

        if(e.target.value[0] === '0') {
            e.target.value = e.target.value.substring(1);
        }

        if(+e.target.value < minValue.current){
            //errorInput.current = `Минимальное значение для поля = ${min}`;
            e.target.value = minValue.current;
        }
        if(+e.target.value > maxValue.current){
            //errorInput.current  = `Максимальное значение для поля = ${max}`;
            e.target.value = maxValue.current;
        }
        form.setFieldValue(field.name, +e.target.value);
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
                    <input
                        step={1}
                        id={props.code}
                        min={props.parameters.min ?? form.values[props.parameters.min_key]}
                        max={props.parameters.max ?? form.values[props.parameters.max_key]}
                        value={field.value}
                        type="number"
                        onChange={(e)=>SetUpTest(e,form,field)}
                    />
                    <div className="errorWrap">
                    {errorInput.current && (
                        <div className="error">{errorInput.current}</div>
                    )}
                    </div>
                </div>
            )}
        </Field>
    );
}

export default NumberField;
