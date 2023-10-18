import React from 'react'
import './styles.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Login2FA() {
    const initialValues = {
        Code2FA: '',
    }

    const onSubmit = (data) => {
        console.log(data);
        //To do: send data to server
    }

    const validationSchema = Yup.object().shape({
        Code2FA: Yup.string().required("Enter OTP code"),
    });

    return (
        <div className='login2FAPage'>
            <h3>OTP Confirmation</h3>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <label>OTP Code: </label>
                    <Field id="inputCode2FA" type="text" name="Code2FA" placeholder="OTP" autoComplete="off" />
                    <ErrorMessage className="error-message" name="Code2FA" component="span" />

                    <button type="submit">Confirm</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Login2FA
