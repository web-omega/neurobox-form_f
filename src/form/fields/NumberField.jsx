import React from 'react';

import {Field, useFormikContext} from 'formik';

function NumberField(props) {
    const { values, submitForm } = useFormikContext();
    return (
        <Field name={props.code} validate={(value)=>{
            let error;
            let min = props.parameters.min ?? values[props.parameters.min_key];
            let max = props.parameters.max ?? values[props.parameters.max_key];
            if(value < min){
                error = `Минимальное значение для поля = ${min}`;
            }
            if(value > max){
                error = `Максимальное значение для поля = ${max}`;
            }
            return error;
        }}>
            {({
                  field, // { name, value, onChange, onBlur }
                  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
              }) => (
                <div>
                    {props.label}
                    <input
                        step={1}
                        // min={props.parameters.min ?? form.values[props.parameters.minKey]}
                        // max={props.parameters.max ?? form.values[props.parameters.maxKey]}
                        value={field.value}
                        type="number"
                        onChange={(e)=>{form.setFieldValue(field.name, +e.target.value)}}/>
                    {meta.touched && meta.error && (
                        <div className="error">{meta.error}</div>
                    )}
                </div>
            )}
        </Field>
    );
}

export default NumberField;