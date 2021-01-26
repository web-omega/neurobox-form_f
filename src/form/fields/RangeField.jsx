import React, {Component} from 'react';

import {Field} from "formik";

function RangeField(props) {

    const SetValue = (e, form, field, type)=>{

        if (type === 'min' && +e.target.value <= +form.values[props.code].max){
            form.setFieldValue(field.name + '.min', +e.target.value);

        }
        if(type === 'max' && +e.target.value >= +form.values[props.code].min) {
            form.setFieldValue(field.name + '.max', +e.target.value)
        }
    }

    return (
        <Field name={props.code}>
            {({
                  field,
                  form,
                  meta,
              }) => (
                <div className={"inputGroup"}>
                    <label htmlFor={props.code}>{props.name}</label>
                    <div className="inputRangeMultiply">
                        <input
                            className={"inputRange"}
                            step={props.parameters.step}
                            id={props.code}
                            min={props.parameters.min ?? form.values[props.parameters.min_key]}
                            max={props.parameters.max ?? form.values[props.parameters.max_key]}
                            value={form.values[props.code].min}
                            type="range"
                            onChange={(e)=>SetValue(e,form,field,'min')}
                        />
                        <input
                            className={"inputRange test"}
                            step={props.parameters.step}
                            id={props.code}
                            min={props.parameters.min ?? form.values[props.parameters.min_key]}
                            max={props.parameters.max ?? form.values[props.parameters.max_key]}
                            value={form.values[props.code].max}
                            type="range"
                            onChange={(e)=>SetValue(e,form,field,'max')}

                        />
                    </div>


                    <div className={"labelMultiple"}>
                        <div className="">{props.parameters.min ?? form.values[props.parameters.min_key]}</div>
                        <div className="value" style={{left: ((field.value.min/(props.parameters.max ?? form.values[props.parameters.max_key]) * 100) ) + '%'}}>{field.value.min}</div>
                        <div className="value" style={{left: ((field.value.max/(props.parameters.max ?? form.values[props.parameters.max_key]) * 100) ) + '%'}}>{field.value.max}</div>
                        <div className="">{props.parameters.max ?? form.values[props.parameters.max_key]}</div>
                    </div>
                </div>
            )}
        </Field>
    )

}
export default RangeField