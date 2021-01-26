import React from 'react';

import {Field, useFormikContext} from 'formik';

function NumberField(props) {
    const { values, submitForm } = useFormikContext();

    let errorInput = null;

    const SetUpTest = (e,form,field) => {
        let min = props.parameters.min ?? values[props.parameters.min_key];
        let max = props.parameters.max ?? values[props.parameters.max_key];
        errorInput = null;

        if(e.target.value[0] === '0') {
            e.target.value = e.target.value.substring(1);
        }

        if(+e.target.value < min){
            errorInput = `Минимальное значение для поля = ${min}`;
            e.target.value = min;
        }
        if(+e.target.value > max){
            errorInput = `Максимальное значение для поля = ${max}`;
            e.target.value = max;
        }
        form.setFieldValue(field.name, +e.target.value);
    }
    return (
        <Field name={props.code} validate={(value)=>{
            return errorInput;
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
                    {meta.error && (
                        <div className="error">{meta.error}</div>
                    )}
                </div>
            )}
        </Field>
    );
}

export default NumberField;
