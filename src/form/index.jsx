import React, {Component} from 'react';
import { Formik } from 'formik';
import detectorParameters from "./JSONs/test-detector-parameters.json";
import detectorDefaultValues from "./JSONs/test-detector-default-values.json";
import detectorUserValues from "./JSONs/test-detector-user-valuess.json";
import {renderFormField} from "../functions";

class Form extends Component {
    render() {
        console.log(detectorParameters);
        return (
            <div>
                <Formik
                    initialValues={Object.assign({}, detectorDefaultValues, detectorUserValues)}
                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                            setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                          /* and other goodies */
                      }) => (
                        <form onSubmit={handleSubmit}>
                            {
                                detectorParameters.map(param => renderFormField(param))
                            }

                            <button type="submit" disabled={isSubmitting}>
                                Submit
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default Form