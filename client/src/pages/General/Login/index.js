import React from 'react'
import './styles.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Login() {
    const initialValues = {
        email: '',
        password: ''
    }

    const onSubmit = (data) => {
        console.log(data);
        //To do: send data to server
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("You must enter an email"),
        password: Yup.string().min(8).required("You must enter a password")
    });

    return (
        <div className='loginPage'>
            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                <Form>
                    <label>Email: </label>
                    <Field id="inputLoginEmail" type="email" name="email" placeholder="Email" autoComplete="off" />
                    <ErrorMessage className="error-message" name="email" component="span" />
                    <label>Password: </label>
                    <Field id="inputLoginPassword" type="password" name="password" placeholder="Password" autoComplete="off" />
                    <ErrorMessage className="error-message" name="password" component="span" />

                    <button type="submit">Login</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Login
