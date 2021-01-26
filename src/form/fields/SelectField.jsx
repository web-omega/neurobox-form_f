import React, {Component} from 'react';
import {Field} from "formik";

function SelectField(props) {

    return (
        <Field name={props.code}>
            {({
                  field,
                  form,
                  meta,
              }) => (
                <div className={"inputGroup"}>
                    <label htmlFor={props.code}>{props.name}</label>
                    <select value={field.value.value}  id={props.code} onChange={(e) =>form.setFieldValue(field.name, + e.target.value)}>
                        {
                            props.parameters.options.map((item)=>{
                                return <option value={item.value} key={item.value} >{item.name}</option>
                            })
                        }
                    </select>

                    {meta.error && (
                        <div className="error">{meta.error}</div>
                    )}
                </div>
            )}
        </Field>
    )

}

export default SelectField