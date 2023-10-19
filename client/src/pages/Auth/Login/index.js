import React, { useState, useEffect } from 'react'; // <-- Importing useState and useEffect
import './styles.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Login() {
    const initialValues = {
        username: '',
        password: ''
    };

    const [csrfToken, setCsrfToken] = useState('');  // <-- New state for CSRF token

    useEffect(() => {
        // Fetch CSRF token when component mounts
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/auth/csrf-token");
                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error("Failed to fetch CSRF token:", error);
            }
        };

        fetchCsrfToken();
    }, []);

    const onSubmit = async (data, { setSubmitting, setFieldError }) => {
        const accountData = {
            username: data.username,
            password: data.password,
        };

        try {
            //const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
            //method: 'POST',
            //headers: {
            //    'Content-Type': 'application/json',
            //    'csrf-token': csrfToken
            //},
            //body: JSON.stringify({ accountData }),
            //credentials: 'include',
            //});


            const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accountData: accountData
                })
            });

            const responseBody = await response.json();  // Parse the JSON response

            console.log(responseBody);

            if (response.ok) {
                window.location.href = "/auth/confirmation";
            }

            //if (response.ok) {
            //    // Handle successful login, e.g. redirect, show success message, etc.
            //    const responseBody = await response.json();
            //    console.log("Login successful!", responseBody);
            //    // Redirect to dashboard or other page
            //    // window.location.href = "/dashboard";
            //} else {
            //    console.error("Login error:", responseBody);
            //    if (responseBody.error && responseBody.error.field === 'username') {
            //        setFieldError('username', responseBody.error.message);
            //    } else if (responseBody.error && responseBody.error.field === 'password') {
            //        setFieldError('password', responseBody.error.message);
            //    }
            //}

        } catch (error) {
            console.error("Failed to login:", error);
        } finally {
            setSubmitting(false);
        }
    };



    const validationSchema = Yup.object().shape({
        username: Yup.string().required("You must enter a username"),
        password: Yup.string().min(8).required("You must enter a password")
    });

    return (
        <div className='loginPage'>
            <h3>Login</h3>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <label>Username: </label>
                    <Field id="inputLoginUsername" type="text" name="username" placeholder="Username" />
                    <ErrorMessage className="error-message" name="username" component="span" />
                    <label>Password: </label>
                    <Field id="inputLoginPassword" type="password" name="password" placeholder="Password" />
                    <ErrorMessage className="error-message" name="password" component="span" />
                    <ErrorMessage className="error-message" name="login-error" component="span" />
                    <button type="submit">Login</button>
                </Form>
            </Formik>
        </div>
    );
}

export default Login;
