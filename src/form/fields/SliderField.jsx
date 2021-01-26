import React, {Component} from 'react';

import {Field, useFormikContext} from 'formik';


function SliderField(props) {
    const { values, submitForm } = useFormikContext();

    let errorInput = null;


    const SetUpTest = (e,form,field) => {

        form.setFieldValue(field.name, +e.target.value);
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
                    <input
                        className={"inputRange"}
                        step={1}
                        id={props.code}
                        list="data"
                        min={props.parameters.min ?? form.values[props.parameters.min_key]}
                        max={props.parameters.max ?? form.values[props.parameters.max_key]}
                        value={field.value}
                        type="range"
                        onChange={(e)=>SetUpTest(e,form,field)}
                    />
                    <div className="labelValue">
                        <div className="min">{props.parameters.min ?? form.values[props.parameters.minKey]}</div>
                        <div className="value" style={{left: ((field.value/(props.parameters.max ?? form.values[props.parameters.max_key]) * 100) * .93) + '%'}}>{field.value}</div>
                        <div className="max">{props.parameters.max ?? form.values[props.parameters.max_key]}</div>
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