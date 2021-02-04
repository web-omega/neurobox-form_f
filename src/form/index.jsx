import React, {Component} from 'react';
import { Formik } from 'formik';
import detectorParameters from "./JSONs/test-detector-parameters.json";
import detectorDefaultValues from "./JSONs/test-detector-default-values.json";
import detectorUserValues from "./JSONs/test-detector-user-valuess.json";
import {renderFormField} from "../functions";

class Form extends Component {
    render() {
        return (
            <div>
                <div className={'labelForm'}> Настройка детектора</div>
                <div className={'nameDetector'}><img src="svg/user.svg" alt=""/> Detector_face_verification</div>
                {/*изменить на актуальное название */}
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

                            <div className="wrapButton">
                                <button type="submit" disabled={isSubmitting}>
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default Form
