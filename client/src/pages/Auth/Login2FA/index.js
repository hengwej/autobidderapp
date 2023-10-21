import React from 'react';
import './styles.css';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';


function Login2FA() {
    const initialValues = {
        Code2FA: '',
    };

    const navigate = useNavigate();


    const onSubmit = async (data, { setSubmitting, setFieldError }) => {

        try {
            const response = await axios.post('http://localhost:5000/api/auth/otp', {
                otp: data.Code2FA,
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log('OTP verification successful!');
                navigate('/');
            }
        } catch (error) {
            console.error('OTP verification failed:', error.response ? error.response.data : error.message);
            setFieldError('otp-error', 'OTP verification failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };


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
    );
}

export default Login2FA;
