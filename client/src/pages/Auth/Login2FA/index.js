import React from 'react';
import './styles.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/AuthProvider';
import * as api from '../../../utils/AuthAPI';
import { Container } from 'react-bootstrap';

function Login2FA() {
    const initialValues = {
        Code2FA: '',
    };

    const { otp } = useAuth();


    const navigate = useNavigate();


    const onSubmit = async (data, { setSubmitting, setFieldError, resetForm }) => {

        try {
            const response = await otp(data.Code2FA);

            if (response.status === 200) {

                console.log('OTP verification successful!');
                window.alert('Login sucessful! You will redirected to the homepage.');
                navigate('/');
            } else if (response.status === 401) {
                // Send alert if otp doesn't match
                window.alert('Invalid OTP! Please try again.');
                // Clear the form fields when the user clicks "OK"
                resetForm();
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
        <Container>
            <h3>OTP Confirmation</h3>
            <div className='login2FAPage'>
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                    <Form>
                        <label>OTP Code: </label>
                        <Field id="inputCode2FA" type="text" name="Code2FA" placeholder="OTP" autoComplete="off" />
                        <ErrorMessage className="error-message" name="Code2FA" component="span" />

                        <button type="submit">Confirm</button>
                    </Form>
                </Formik>
            </div>
        </Container>
    );
}

export default Login2FA;
