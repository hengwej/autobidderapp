import React from 'react'
import './styles.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Login() {
    const initialValues = {
        username: '',
        password: ''
    }

    const onSubmit = (data) => {
        console.log(data);
        //To do: send data to server
    }

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

                    <button type="submit">Login</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Login
