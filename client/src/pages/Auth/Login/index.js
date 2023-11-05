import './styles.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { Container } from 'react-bootstrap';
import { useAuth } from '../../../utils/AuthProvider';

function Login() {
    const initialValues = {
        username: '',
        password: ''
    };

    const isTestEnvironment = process.env.REACT_APP_ENVIRONMENT === 'test';


    const { login, user } = useAuth();
    const navigate = useNavigate();
    const recaptchaRef = useRef();

    const [isButtonDisabled, setIsButtonDisabled] = useState(!isTestEnvironment);


    if (user) {
        navigate('/');
    }

    const onSubmit = async (data, { setSubmitting, setFieldError, resetForm }) => {
        setIsButtonDisabled(true);
        const { username, password } = data;
        // start of captcha logic, uncomment to get it up    

        if (!isTestEnvironment) {
            const recaptchaValue = recaptchaRef.current.getValue();
            if (!recaptchaValue) {
                alert("Please verify you're not a robot.");
            }
            else {
                try {

                    const response = await login(username, password);

                    if (response.status === 200) {
                        console.log('Login successful!');
                        // Pop-up to tell user that otp is sent to email
                        window.alert('An OTP has been sent to your email!');
                        navigate('/auth/confirmation');
                    } else if (response.status === 401) {
                        window.alert('Invalid username or password! Please try again.');
                        // Clear the form fields and reset CAPTCHA when the user clicks "OK"
                        recaptchaRef.current.reset();
                        resetForm();
                    }
                } catch (error) {
                    console.error("Failed to login:", error);
                    setFieldError('login-error', 'Failed to login. Please check your credentials and try again.');
                } finally {
                    setSubmitting(false);
                }
            }
        } else {
            try {

                const response = await login(username, password);

                if (response.status === 200) {
                    console.log('Login successful!');
                    // Pop-up to tell user that otp is sent to email
                    window.alert('An OTP has been sent to your email!');
                    navigate('/auth/confirmation');
                } else if (response.status === 401) {
                    window.alert('Invalid username or password! Please try again.');
                    // Clear the form fields and reset CAPTCHA when the user clicks "OK"
                    //recaptchaRef.current.reset();
                    resetForm();
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
        <Container>
            <h3>Login</h3>
            <div className='loginPage'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({ isSubmitting, isValid, values }) => (
                        <Form>
                            <label>Username: </label>
                            <Field id="inputLoginUsername" data-testid="inputLoginUsername" type="text" name="username" placeholder="Username" />
                            <ErrorMessage className="error-message" name="username" component="span" />
                            <label>Password: </label>
                            <Field id="inputLoginPassword" data-testid="inputLoginPassword" type="password" name="password" placeholder="Password" />
                            <ErrorMessage className="error-message" name="password" component="span" />
                            <ErrorMessage className="error-message" name="login-error" component="span" />
                            {!isTestEnvironment && (
                                <ReCAPTCHA
                                    data-testid="reCAPTCHA"
                                    ref={recaptchaRef}
                                    sitekey={process.env.REACT_APP_RECAPTCHA_CLIENT_KEY} // change to .env, temporary testing key, please swap out later              
                                    onChange={(value) => {
                                        console.log("Captcha value:", value);
                                        setIsButtonDisabled(false);
                                    }} //value will be parsed into backend as "token"
                                />
                            )}
                            <button type="submit" disabled={isSubmitting || !isValid || !values.username || values.password.length < 8 || isButtonDisabled}>
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    );
}

export default Login;
