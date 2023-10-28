import React from 'react'
import './styles.css'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as api from '../../../utils/AuthAPI';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

function SignUp() {
    const navigate = useNavigate();
    const initialValues = {
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
    }

    const onSubmit = async (data) => {
        const accountData = {
            username: data.username,
            password: data.password,
        }

        const userData = {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            emailAddress: data.emailAddress
        }

        try {
            const response = await api.signup(accountData, userData);

            if (response.status === 200) {
                console.log('Account created successfully!');
                navigate('/auth/login');
            }


        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }



    const validationSchema = Yup.object().shape({
        username: Yup.string().required("You must enter a username"),
        emailAddress: Yup.string().email("Invalid email").required("You must enter an email"),
        password: Yup.string().min(8).required("You must enter a password"),
        firstName: Yup.string().required("You must enter a first name"),
        lastName: Yup.string().required("You must enter a last name"),
        address: Yup.string().required("You must enter an address"),
        phoneNumber: Yup.string().required("You must enter a phone number")
    });

    return (
        <Container>
            <h3>Sign Up</h3>
            <div className='signUpPage'>
                <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                    <Form>
                        <label>Username: </label>
                        <Field id="inputSignUpUsername" type="text" name="username" placeholder="Username" />
                        <ErrorMessage className="error-message" name="username" component="span" />
                        <label>Email: </label>
                        <Field id="inputSignUpEmail" type="email" name="emailAddress" placeholder="Email" />
                        <ErrorMessage className="error-message" name="emailAddress" component="span" />
                        <label>Password: </label>
                        <Field id="inputSignUpPassword" type="password" name="password" placeholder="Password" />
                        <ErrorMessage className="error-message" name="password" component="span" />
                        <label>First Name: </label>
                        <Field id="inputSignUpFirstName" type="text" name="firstName" placeholder="First Name" />
                        <ErrorMessage className="error-message" name="firstName" component="span" />
                        <label>Last Name: </label>
                        <Field id="inputSignUpLastName" type="text" name="lastName" placeholder="Last Name" />
                        <ErrorMessage className="error-message" name="lastName" component="span" />
                        <label>Address: </label>
                        <Field id="inputSignUpAddress" type="text" name="address" placeholder="Address" />
                        <ErrorMessage className="error-message" name="address" component="span" />
                        <label>Phone Number: </label>
                        <Field id="inputSignUpPhoneNumber" type="text" name="phoneNumber" placeholder="Phone Number" />
                        <ErrorMessage className="error-message" name="phoneNumber" component="span" />

                        <button type="submit">Sign Up</button>
                    </Form>
                </Formik>
            </div>
        </Container>
    )
}

export default SignUp
