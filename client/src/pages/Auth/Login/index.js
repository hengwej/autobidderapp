import './styles.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import * as api from '../../../utils/AuthAPI';

function Login() {
    const initialValues = {
        username: '',
        password: ''
    };

    const navigate = useNavigate();
    const recaptchaRef = useRef();
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const onSubmit = async (data, { setSubmitting, setFieldError }) => {
        setIsButtonDisabled(true);
        const { username, password } = data;
        // start of captcha logic, uncomment to get it up    
        const recaptchaValue = recaptchaRef.current.getValue();
        if (!recaptchaValue) {
            alert("Please verify you're not a robot.");
        } else {
            try {

                const response = await api.login(username, password);

                if (response.status === 200) {
                    document.cookie = `token=${response.data.token}; HttpOnly; Secure; SameSite=None`;
                    navigate('/auth/confirmation');
                }
            } catch (error) {
                console.error("Failed to login:", error);
                setFieldError('login-error', 'Failed to login. Please check your credentials and try again.');
            } finally {
                setSubmitting(false);
            }
        }//end of captcha logic
    };


    const validationSchema = Yup.object().shape({
        username: Yup.string().required("You must enter a username"),
        password: Yup.string().min(8).required("You must enter a password")
    });

    return (
        <div className='loginPage'>
            <h3>Login</h3>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({ isSubmitting, isValid, values }) => (
                    <Form>
                        <label>Username: </label>
                        <Field id="inputLoginUsername" type="text" name="username" placeholder="Username" />
                        <ErrorMessage className="error-message" name="username" component="span" />
                        <label>Password: </label>
                        <Field id="inputLoginPassword" type="password" name="password" placeholder="Password" />
                        <ErrorMessage className="error-message" name="password" component="span" />
                        <ErrorMessage className="error-message" name="login-error" component="span" />
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // change to .env, temporary testing key, please swap out later              
                            onChange={(value) => console.log("Captcha value:", value)} //value will be parsed into backend as "token"
                        />
                        <button type="submit" disabled={isSubmitting || !isValid || !values.username || values.password.length < 8}>
                            Login
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Login;
