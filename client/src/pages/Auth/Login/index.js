import './styles.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';


function Login() {
    const initialValues = {
        username: '',
        password: ''
    };

    const navigate = useNavigate();



    const onSubmit = async (data, { setSubmitting, setFieldError }) => {
        const { username, password } = data;

        try {
            const response = await axios.post("http://127.0.0.1:5000/api/auth/login", {
                username,
                password
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                document.cookie = `token=${response.data.token}; HttpOnly; Secure; SameSite=Strict`;
                navigate('/auth/confirmation');
            }
        } catch (error) {
            console.error("Failed to login:", error);
            setFieldError('login-error', 'Failed to login. Please check your credentials and try again.');
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
